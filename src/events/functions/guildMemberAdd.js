import client from '../../client.js';
import { inviteTracker } from 'discord-inviter';
import { InviteManager } from '../classes/inviteManager.js';

const tracker = new inviteTracker(client);
const inviteManager = new InviteManager();

tracker.on("guildMemberAdd", async (member, inviter, invite) => {
    if (member.guild.id !== "1109464496164048996") return;
    
    try {
        await inviteManager.inviteMember(member, inviter, invite);
    } catch (error) {
        console.error('Erro ao processar guildMemberAdd:', error);
    }
});