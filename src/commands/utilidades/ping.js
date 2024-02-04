import { ButtonStyle, ApplicationCommandType } from 'discord.js';
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require('../../JSON/emojis.json')

export default {
    name: "ping",
    description: "〔⚙️ Utilidade〕 Veja meu ping.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,

    run: async (client, interaction, isButton) => {
        if (isButton)
            await interaction.update({ content: `${e.Load} | Pinging...`, components: [] }).catch(() => { })
        else await interaction.reply({ content: `${e.Load} | Pinging...` }).catch(() => { })


        let toSubtract = Date.now()
        const replayPing = Date.now() - interaction.createdAt.valueOf()
        toSubtract = Date.now()

        const data = {
            content: `⏱️ | ${Date.stringDate(client.uptime)}\n${e.Slash} | Interações: ${client.interactions || 0}\n${e.Hello} | Mensagens: ${client.messages || 0} \n${e.Anya_pulo} | Events: ${client.events || 0} \n${e.Discord} | Discord API Latency: ${emojiFormat(client.ws.ping)}\n⚡ | Interaction Response: ${emojiFormat(replayPing)}`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: `Atualizar`,
                            emoji: '🔃',
                            custom_id: JSON.stringify({ key: 'ping' }),
                            style: ButtonStyle.Primary,
                        }
                    ]
                }
            ]
        }
        if (isButton)
            interaction.message.edit(data)
        else await interaction.editReply(data)
    }
}



function emojiFormat(ms) {
    if (!ms) return "💔 Offline"

    const intervals = [800, 600, 400, 200, 0]
    const emojis = ["🔴", "🟤", "🟠", "🟡", "🟢", "🟣"]

    let emoji = "🟣"
    for (let i = 0; i < intervals.length; i++)
        if (ms >= intervals[i]) {
            emoji = emojis[i]
            break
        }

    return `${emoji} **${ms}**ms`
}


export {
    emojiFormat

}