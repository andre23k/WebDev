import client from '../../client.js';
import { inviteTracker } from 'discord-inviter';
import { InviteManager } from '../classes/inviteManager.js';


const tracker = new inviteTracker(client);
const inviteManager = new InviteManager();


tracker.on("guildMemberAdd", async (member, inviter, invite) => {
    client.events++;
    if (member.guild.id !== "1109464496164048996")
        return;
    await inviteManager.inviteMember(member, inviter, invite);
});
