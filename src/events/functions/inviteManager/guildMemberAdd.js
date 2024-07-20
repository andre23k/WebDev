import client from '../../../client.js';
import Database from '../../../database/Database.js';
import { BitColors } from '../../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

client.on('guildMemberAdd', async member => {
    try {
        const cachedInvites = client.invites.get(member.guild.id);
        const guildInvites = await member.guild.invites.fetch();
        client.invites.set(member.guild.id, new Map(guildInvites.map(inv => [inv.code, inv.uses])));

        const usedInvite = guildInvites.find(inv => cachedInvites?.get(inv.code) < inv.uses);
        const inviter = usedInvite ? usedInvite.inviter : null;
        const inviteCode = usedInvite ? usedInvite.code : null;

        const data = await Database.Guild.findOne({ Id: member.guild.id });
        if (!data || data.register.activeEvent === false) return;

        const inviteChannel = client.channels.cache.get(data.register.invitechannelId);
        const welcomeChannel = client.channels.cache.get(data.register.welcomechannelId);
        if (!inviteChannel || !welcomeChannel) return;

        let message;
        if (!inviter) {
            message = `🇵🇹 | Bem-vindo ${member}, foi convidado, mas não consegui descobrir quem o convidou!`;
        } else if (member.id === inviter.id) {
            message = `🇵🇹 | Bem-vindo ${member}, entrou no servidor pelo próprio convite!`;
        } else if (member.guild.vanityURLCode === inviteCode) {
            message = `🇵🇹 | ${member} entrou pelo convite personalizado!`;
        } else {
            await saveInviteCount(member.guild.id, inviter.id);
            const inviteCount = await getInviteCount(member.guild.id, inviter.id);
            message = `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviter.id}>. Que agora tem ${inviteCount} invites.`;
        }

        await inviteChannel.send(message).catch(err => { console.log(err) });

        await welcomeChannel.send({
            embeds: [{
                title: 'Entrou no servidor!',
                color: BitColors.DarkRed,
                description: `${e.Ids} **Membro:** ${member}\n⠀ ${e.Ids} **ID:** \`${member.user.id}\`\n⠀ ${e.Ids} **Tag:** \`${member.user.tag}\` `,
                author: {
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true } || null)
                },
                thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
            }]
        }).catch(err => { console.log(err) });

    } catch (error) {
        console.error('Erro ao processar guildMemberAdd:', error);
    }
});

async function getInviteCount(guildId, inviterId) {
    try {
        const guild = await Database.Guild.findOne({ Id: guildId, "invites.userid": inviterId });
        if (guild) {
            const inviterData = guild.invites.find(invite => invite.userid === inviterId);
            return inviterData ? inviterData.count : 0;
        }
        return 0;
    } catch (error) {
        console.error('Erro ao carregar contagens de convites:', error);
        return 0;
    }
}

async function saveInviteCount(guildId, inviterId) {
    try {
        const guild = await Database.Guild.findOne({ Id: guildId });
        if (!guild) {
            console.error(`Guild not found: ${guildId}`);
            return;
        }

        const existingInvite = guild.invites.find(invite => invite.userid === inviterId);

        if (existingInvite) {
            await Database.Guild.updateOne(
                { Id: guildId, "invites.userid": inviterId },
                { $inc: { "invites.$.count": 1 } }
            );
        } else {
            await Database.Guild.updateOne(
                { Id: guildId },
                { $push: { invites: { userid: inviterId, count: 1 } } }
            );
        }
    } catch (error) {
        console.error('Erro ao salvar contagem de convites:', error);
    }
}