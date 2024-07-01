import client from '../../client.js';
import { inviteTracker } from 'discord-inviter';
import inviteMember from '../functions/inviteManager.js';
import Database from '../../database/Database.js';

const tracker = new inviteTracker(client);

tracker.on("guildMemberAdd", async (member, inviter, invite) => {
    const data = await Database.Guild.findOne({ Id: member.guild.id })
    if (data && data.register.activeEvent)
        await inviteMember(member, inviter, invite);
});