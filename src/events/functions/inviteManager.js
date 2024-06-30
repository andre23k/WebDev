import client from '../../client.js';
import Database from '../../database/Database.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

let inviteCounts = new Map();
let membersRegistered = new Set();


export default async function inviteMember(member, inviter, invite) {
    try {
        await registerMemberAdd(member);

        const data = await Database.Register.findOne({ guildId: member.guild.id });
        const channel = client.channels.cache.get(data.invitechannelId);
        if (!channel) return;

        let message;
        const memberId = member.id;

        if (!membersRegistered.has(memberId)) {
            membersRegistered.add(memberId);
            message = await generateWelcomeMessage(member, inviter, invite);
        } else {
            message = `🇵🇹 | Bem-vindo ${member}, entrou no servidor, mas já esteve aqui!`;
        }

        await channel.send(message);
    } catch (error) {
        console.error('Erro ao processar inviteMember:', error);
    }
}


async function loadInviteCounts(inviterId) {
    try {
        const inviteCountsData = await Database.Invite.findOne({ userid: inviterId });
        if (inviteCountsData) {
            inviteCounts.set(inviterId, inviteCountsData.count);
        }
    } catch (error) {
        console.error('Erro ao carregar contagens de convites:', error);
    }
}

async function saveInviteCounts(inviterId) {
    try {
        const count = inviteCounts.get(inviterId) || 0;
        await Database.Invite.updateOne(
            { userid: inviterId },
            { $set: { count: count } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Erro ao salvar contagens de convites:', error);
    }
}

async function registerMemberAdd(member) {
    try {   
       
        const data = await Database.Register.findOne({ guildId: member.guild.id });
        const channel = client.channels.cache.get(data.welcomechannelId);
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

function updateInviteCounts(inviterId) {
    const currentCount = inviteCounts.get(inviterId) || 0;
    inviteCounts.set(inviterId, currentCount + 1);
}

function getInviteCount(inviterId) {
    return inviteCounts.get(inviterId) || 0;
}

async function generateWelcomeMessage(member, inviter, invite) {
    try {
        if (member.user.bot) {
            return `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviter.id}>`;
        }

        if (!inviter) {
            return `🇵🇹 | Bem-vindo ${member}, foi convidado, mas não consegui descobrir quem o convidou!`;
        } else if (member.id === inviter.id) {
            return `🇵🇹 | Bem-vindo ${member}, entrou no servidor pelo próprio convite!`;
        } else if (member.guild.vanityURLCode === invite?.code) {
            return `🇵🇹 | ${member} entrou pelo convite personalizado!`;
        } else {
            const inviterId = inviter.id;
            await loadInviteCounts(inviterId);
            updateInviteCounts(inviterId);
            await saveInviteCounts(inviterId);
            return `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviterId}>. Que agora tem ${getInviteCount(inviterId)} invites.`;
        }
    } catch (error) {
        console.error('Erro ao gerar mensagem de boas-vindas:', error);
        return `🇵🇹 | Bem-vindo ${member}, ocorreu um erro ao tentar gerar a mensagem de boas-vindas.`;
    }
}
