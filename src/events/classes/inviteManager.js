import fs from 'fs';
import { JsonDB } from "json-db-manager"

const filePath = 'inviteCounts.json';
const filePathIDs = 'validIDs.json';

let JsonMn = new JsonDB(2, "utf-8").path(filePath)
let JsonIDs = new JsonDB(2, "utf-8").path(filePathIDs)

export class InviteManager {
    constructor() {
        this.inviteCounts = new Map();
        this.loadInviteCounts();
        this.arr = []
    }

    loadInviteCounts() {
        try {
            for (const [userId, count] of Object.entries(JsonMn.get())) {
                this.inviteCounts.set(userId, count);
            }
        } catch (error) {
            console.error('Error loading invite counts:', error);
        }
    }

    saveInviteCounts() {
        const jsonData = JSON.stringify(Object.fromEntries(this.inviteCounts));
        fs.writeFileSync('inviteCounts.json', jsonData);
    }

    handleGuildMemberAdd(member, inviter, invite, error) {
        let msg = "";
        const channel = member.guild.channels.cache.get("1194415819908731042");

        if (error) {
            console.error(error);
            return;
        }

        if (!JsonIDs.get('ids').includes(member.id)) {
            if (!inviter) {
                msg = `🇵🇹 | Welcome ${member}, foi convidado, mas não consegui descobrir quem o convidou!`;
            } else if (member.id === inviter.id) {
                msg = `🇵🇹 | Welcome ${member}, Entrou no servidor pelo próprio convite!`;
            } else if (member.guild.vanityURLCode === invite?.code) {
                msg = `🇵🇹 | ${member} Entrou pelo convite personalizado!`;
            } else {
                let inviterId = inviter.id;
                this.loadInviteCounts();
                this.updateInviteCounts(inviterId);
                msg = `🇵🇹 | Welcome ${member}, foi convidado por <@!${inviterId}>. Que tem agora ${this.getInviteCount(inviterId)} invites.`;
            }
        this.arr.push(member.id);
        JsonIDs.set("ids", this.arr)
        } else { msg = `🇵🇹 | Welcome ${member}, entrou no servidor, mas já esteve aqui!`; }
        if (member.user.bot) msg = `🇵🇹 | Welcome ${member}, foi convidado por <@!${inviter.id}>`;

        channel.send(msg);

    }

    updateInviteCounts(inviterId) {
        let currentCount = this.inviteCounts.get(inviterId) || 0;
        currentCount = currentCount + 1
        this.inviteCounts.set(inviterId, currentCount);
        this.saveInviteCounts();
    }
    getInviteCount(inviterId) { return this.inviteCounts.get(inviterId) || 0; }
}