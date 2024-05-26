import client from '../../client.js';
import Database from '../../database/Database.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export class InviteManager {
    constructor() {
        this.inviteCounts = new Map();
        this.arr = new Set();
    }

    async loadInviteCounts(inviterId) {
        try {
            const inviteCounts = await Database.Invite.findOne({ userid: inviterId });
            if (inviteCounts) {
                this.inviteCounts.set(inviterId, inviteCounts.count);
            }
        } catch (error) {
            console.error('Erro ao carregar contagens de convites: ', error);
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
            console.error('Erro ao salvar', error);
        }
    }

    async inviteMember(member, inviter, invite) {
        await this.registerMemberAdd(member);
    
        const channel = member.guild.channels.getById("1194415819908731042")
        let msg;
        const memberId = member.id;
    
        if (!this.arr.has(memberId)) {
            this.arr.add(memberId);
    
            if (!inviter) {
                msg = `🇵🇹 | Bem-vindo ${member}, foi convidado, mas não consegui descobrir quem o convidou!`;
            } else if (memberId === inviter.id) {
                msg = `🇵🇹 | Bem-vindo ${member}, entrou no servidor pelo próprio convite!`;
            } else if (member.guild.vanityURLCode === invite?.code) {
                msg = `🇵🇹 | ${member} entrou pelo convite personalizado!`;
            } else {
                const inviterId = inviter.id;
                await this.loadInviteCounts(inviterId);
                this.updateInviteCounts(inviterId);
                msg = `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviterId}>. Que agora tem ${this.getInviteCount(inviterId)} invites.`;
                await this.saveInviteCounts(inviterId);
            }
        } else {
            msg = `🇵🇹 | Bem-vindo ${member}, entrou no servidor, mas já esteve aqui!`;
        }
    
        if (member.user.bot) {
            msg = `🇵🇹 | Bem-vindo ${member}, foi convidado por <@!${inviter.id}>`;
        }
    
        await channel.send(msg);
        
        return;
    }

    updateInviteCounts(inviterId) {
        let currentCount = this.inviteCounts.get(inviterId) || 0;
        this.inviteCounts.set(inviterId, currentCount + 1);
    }

    getInviteCount(inviterId) {
        return this.inviteCounts.get(inviterId) || 0;
    }

    async registerMemberAdd(member) {
        const channel = await client.channels.fetch('1194415665503797288');
        if (!channel) return;
        await channel.send({
            embeds: [{
                title: `Entrou no servidor!`,
                color: BitColors.DarkRed,
                description: `${e.Ids} **Membro:** ${member}\n⠀ ${e.Ids} **ID:**\`${member.user.id}\`\n⠀ ${e.Ids} **Tag:**\`${member.user.tag}\` `,
                author: { name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
            }]
        });
        return;
    }
}
