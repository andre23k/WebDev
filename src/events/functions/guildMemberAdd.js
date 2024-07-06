import client from '../../client.js';
import { inviteTracker } from 'discord-inviter';
import inviteMember from '../functions/inviteManager.js';
import Database from '../../database/Database.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

const tracker = new inviteTracker(client);

tracker.on("guildMemberAdd", async (member, inviter, invite) => {
    const data = await Database.Guild.findOne({ Id: member.guild.id })
    if (data && data.register.activeEvent)
        await inviteMember(member, inviter, invite);
});

client.on('guildMemberAdd', async (member) => {
    const data = await Database.Guild.findOne({ Id: member.guild.id });
    if (!data || data.register.activeEvent === false) return;
    const channel = client.channels.cache.get(data.register.welcomechannelId);
    if (!channel) return;

    await channel.send({
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
    });
}
)