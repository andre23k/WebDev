import client from "../../../core/client.js";
import { createRequire } from 'node:module';
import { BitColors } from "../../../util/constants.js";
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

client.on('messageDelete', async message => {
    if (message.author?.bot) return;
    if (message.partial) return;
    const guild = client.guilds.cache.get('1291872723026448445')
    const channel = await guild.channels.fetch('1291887995842199552');
    await channel.send({
        embeds: [{
            title: `Message deleted!`,
            author: ({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }),
            thumbnail: { url: message.author.displayAvatarURL({ forceStatic: true }) || null },
            color: BitColors.DarkGreen,
            fields: [
                {
                    name: `${e.Users} | User:`,
                    value: `${message.author} | \`${message.author.id}\``,
                },
                {
                    name: `💬 | Channel:`,
                    value: `${message.channel}`,
                },
                {
                    name: `Deleted message:`,
                    value: `\`\`\`${message.content.slice(0, 1024)}\`\`\``,
                }
            ]
        }]
    })
})