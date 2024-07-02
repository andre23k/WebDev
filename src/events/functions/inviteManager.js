import client from '../../client.js';
import Database from '../../database/Database.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default async function inviteMember(member, inviter, invite) {
    try {

        const data = await Database.Guild.findOne({ Id: member.guild.id });
        const channel = client.channels.cache.get(data.register.invitechannelId);
        if (!channel) return;

        let message;

        if (!inviter) {
            message = `🇵🇹 | Bem-vindo ${member}, foi convidado, mas não consegui descobrir quem o convidou!`;
        } else if (member.id === inviter.id) {
            message = `🇵🇹 | Bem-vindo ${member}, entrou no servidor pelo próprio convite!`;
        } else if (member.guild.vanityURLCode === invite?.code) {
            message = `🇵🇹 | ${member} entrou pelo convite personalizado!`;
        } else {
            const inviterId = inviter.id;
            await saveInviteCount(member.guild.id, inviterId);
            const inviteCount = await getInviteCount(member.guild.id, inviterId);
            message = `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviterId}>. Que agora tem ${inviteCount} invites.`;
        }

        await channel.send(message);
        await registerMemberAdd(member);
    } catch (error) {
        console.error('Erro ao processar inviteMember:', error);
    }
}

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
async function registerMemberAdd(member) {
    try {
        const data = await Database.Guild.findOne({ Id: member.guild.id });
        const channel = client.channels.cache.get(data.register.welcomechannelId);
        if (!channel) return;

        await channel.send({
            embeds: [{
                title: 'Entrou no servidor!',
                color: BitColors.DarkRed,
                description: `${e.Ids} **Membro:** ${member}\n⠀ ${e.Ids} **ID:** \`${member.user.id}\`\n⠀ ${e.Ids} **Tag:** \`${member.user.tag}\` `,
                author: {
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                },
                thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
            }]
        });
    } catch (error) {
        console.error('Erro ao registrar a entrada do membro:', error);
    }
}
