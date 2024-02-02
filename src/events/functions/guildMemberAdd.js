import client from '../../client.js';
import { BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
import { inviteTracker } from 'discord-inviter';
import { InviteManager } from '../classes/inviteManager.js';

const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");
const tracker = new inviteTracker(client);
const inviteManager = new InviteManager();


tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {  
    console.log(member.user.id);
    client.events++;
    if (member.guild.id !== "1109464496164048996")
        return;
    let channel = await client.channels.fetch('1194415665503797288');
   await channel.send({
        embeds: [{
            title: `Entrou no servidor!`,
            color: BitColors.DarkRed,
            description: `${e.Ids} **Membro:** ${member}\n⠀ ${e.Ids} **ID:**\`${member.user.id}\`\n⠀ ${e.Ids} **Tag:**\`${member.user.tag}\` `,
            author: ({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }),
            thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
        }]
    });
  await inviteManager.handleGuildMemberAdd(member, inviter, invite, error);
});
