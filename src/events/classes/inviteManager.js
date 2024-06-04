import client from '../../client.js';
import Database from '../../database/Database.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export class InviteManager {
    constructor() {
        this.inviteCounts = new Map();
        this.membersRegistered = new Set();
    }

    async loadInviteCounts(inviterId) {
        try {
            const inviteCounts = await Database.Invite.findOne({ userid: inviterId });
            if (inviteCounts) {
                this.inviteCounts.set(inviterId, inviteCounts.count);
            }
        } catch (error) {
            console.error('Erro ao carregar contagens de convites:', error);
        }
    }

    async saveInviteCounts(inviterId) {
        try {
            const count = this.inviteCounts.get(inviterId) || 0;
            await Database.Invite.updateOne(
                { userid: inviterId },
                { $set: { count: count } },
                { upsert: true }
            );
        } catch (error) {
            console.error('Erro ao salvar contagens de convites:', error);
        }
    }

    async inviteMember(member, inviter, invite) {
        try {
            await this.registerMemberAdd(member);

            const channel = await member.guild.channels.fetch("1194415819908731042");
            if (!channel) return;

            let message;
            const memberId = member.id;

            if (!this.membersRegistered.has(memberId)) {
                this.membersRegistered.add(memberId);
                message = await this.generateWelcomeMessage(member, inviter, invite);
            } else {
                message = `🇵🇹 | Bem-vindo ${member}, entrou no servidor, mas já esteve aqui!`;
            }

            await channel.send(message);
        } catch (error) {
            console.error('Erro ao processar inviteMember:', error);
        }
    }

    async generateWelcomeMessage(member, inviter, invite) {
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
                await this.loadInviteCounts(inviterId);
                this.updateInviteCounts(inviterId);
                await this.saveInviteCounts(inviterId);
                return `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviterId}>. Que agora tem ${this.getInviteCount(inviterId)} invites.`;
            }
        } catch (error) {
            console.error('Erro ao gerar mensagem de boas-vindas:', error);
            return `🇵🇹 | Bem-vindo ${member}, ocorreu um erro ao tentar gerar a mensagem de boas-vindas.`;
        }
    }

    updateInviteCounts(inviterId) {
        const currentCount = this.inviteCounts.get(inviterId) || 0;
        this.inviteCounts.set(inviterId, currentCount + 1);
    }

    getInviteCount(inviterId) {
        return this.inviteCounts.get(inviterId) || 0;
    }

    async registerMemberAdd(member) {
        try {
            const channel = await client.channels.fetch('1194415665503797288');
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
}