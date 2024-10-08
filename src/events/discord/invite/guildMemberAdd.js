import client from '../../../core/client.js';
import Database from '../../../database/Database.js';
import { BitColors } from '../../../util/constants.js';
import { createRequire } from 'node:module';
import roleAdd from '../autorole/addrole.js';
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

client.on("guildMemberAdd", async member => {
    roleAdd(member)
    try {
        const { guild } = member;

        const cachedInvites = client.invites.get(guild.id);
        const guildInvites = await guild.invites.fetch();
        if (!guildInvites?.size) return;
        client.invites.set(guild.id, new Map(guildInvites.map(inv => [inv.code, inv.uses])));
        const usedInvite = guildInvites.find(inv => !cachedInvites.has(inv.code) || cachedInvites.get(inv.code) < inv.uses);

        const inviter = usedInvite ? usedInvite.inviter : null;
        const vanityURLCode = guild.vanityURLCode || null;
        const data = await Database.Guild.findOne({ Id: guild.id });
        const welcomeChannel = await guild.channels.fetch(data.register.welcomechannelId);
        const inviteChannel = await guild.channels.fetch(data.register.invitechannelId);
        if (!data || data.register?.activeEvent === false) return;
        if (!inviteChannel || !welcomeChannel) return;

        let message;

        if (vanityURLCode === "webdev" && !usedInvite) {
            message = `${e.vscode} | <@${member.id}> joined via personalized invite!`;
        } else if (member.id === inviter?.id) {
            message = `${e.vscode} | Welcome <@${member.id}>, you joined the server by your own invitation!`;
        } else if (inviter) {
            await saveInviteCount(guild.id, inviter.id);
            const inviteCount = await getInviteCount(guild.id, inviter.id);
            message = `${e.vscode} | Welcome <@${member.id}>, you have been invited by <@${inviter.id}>. Who now has ${inviteCount} invites.`;
        } else {
            message = `${e.vscode} | Welcome <@${member.id}>, you were invited but I couldn't find out who invited you!`;
        }

        await inviteChannel.send(message);

        await welcomeChannel.send({
            embeds: [{
                title: 'Joined the server!',
                color: BitColors.DarkRed,
                description: `${e.Ids} **Member:** ${member}\n⠀ ${e.Ids} **ID:** \`${member.user.id}\`\n⠀ ${e.Ids} **Tag:** \`${member.user.tag}\` `,
                author: {
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL({ dynamic: true } || null)
                },
                thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
            }]
        });
        
    } catch (error) {
        console.error('guildMemberAdd:', error);
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
        console.error(error);
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
        console.error(error);
    }
}
