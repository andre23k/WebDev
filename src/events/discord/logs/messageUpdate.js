import { ButtonStyle } from "discord.js";
import client from "../../../core/client.js";
import { BitColors } from "../../../util/constants.js";

client.on("messageUpdate", async (oldMessage, newMessage) => {
    const GuildId = '1291872723026448445';
    const ChannelId = '1291887995842199552'

    if (!newMessage || !newMessage.id || newMessage?.author?.bot) return
    if (!oldMessage || !oldMessage.id || newMessage?.author?.bot) return

    if (oldMessage.partial || newMessage.partial) {
        newMessage = await newMessage.fetch().catch(() => null)
        oldMessage = await oldMessage.fetch().catch(() => null)
    }

    if (!newMessage || !oldMessage) return

    const oldContent = oldMessage?.content
    const newContent = newMessage?.content

    const isEdited = oldContent !== newContent
    if (!isEdited || !oldContent?.length || !newContent?.length) return

    const { author, type } = newMessage
    if (type !== 0) return

    const embeds = [{
        color: BitColors.DarkGreen,
        title: "Edited message data",
        description: `This message has been edited on the channel ${newMessage.channel}`,
        fields: [
            {
                name: '👤 Who edited it?',
                value: `- ${author?.username || "Not Found"} - \`${author?.id}\`\n`
            }
        ]
    }]

    if (oldContent) {
        if (oldContent?.length <= 1018)
            embeds[0].fields.push({
                name: '📝 Old Content',
                value: `\`\`\`${oldContent?.slice(0, 1018)}\`\`\``
            })
        else embeds.push({
            color: client.blue,
            title: '📝 New Content',
            description: `\`\`\`${oldContent?.slice(0, 4090)?.limit('MessageEmbedDescription')}\`\`\``
        })
    }

    if (newContent) {
        if (newContent?.length <= 1018)
            embeds[0].fields.push({
                name: '📝 Old Content',
                value: `\`\`\`${newContent?.slice(0, 1018)}\`\`\``
            })
        else embeds.push({
            color: client.blue,
            title: '📝 New Content',
            description: `\`\`\`${newContent?.slice(0, 4090)}\`\`\``.limit('MessageEmbedDescription')
        })
    }
    const destinationGuild = client.guilds.cache.get(GuildId);
    if (!destinationGuild) return;


    const logChannel = await destinationGuild.channels.fetch(ChannelId).catch(() => null);
    if (!logChannel) return;
    await logChannel.send({
        content: `Message Edited`,
        embeds,
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Go to message",
                    url: newMessage.url,
                    style: ButtonStyle.Link
                }
            ]
        }]
    })
})