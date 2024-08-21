import translate from '@iamtraction/google-translate'
import { Languages } from '../../util/constants.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
    name: 'Translate Message',
    category: "context menu",
    dm_permission: false,
    name_localizations: { "en-US": "Translate", 'pt-BR': 'Traduzir' },
    type: 3,

    run: async (client, interaction, args) => {

        const { targetMessage, locale } = interaction
        const formatedLocale = locale.split('-')[0]
        let text = targetMessage.content

        if (!text)
            return await interaction.reply({
                content: `${e.Saphire_recusado} | There is no text to translate in this message.`,
                ephemeral: true
            })

        if (text.length > 1013)
            text = `${text.slice(0, 1010)}...`

        const Embed = {
            color: 0x4295FB,
            author: { name: 'Google Translate', iconURL: 'https://media.discordapp.net/attachments/893361065084198954/1002389116329144440/unknown.png?width=484&height=484' },
            fields: [{
                name: 'Text',
                value: `\`\`\`txt\n${text}\n\`\`\``
            }]
        }

        await interaction.deferReply({ ephemeral })

        return translate(text, { to: formatedLocale })
            .then(async res => {

                if (res.text.length > 1013)
                    res.text = `${res.text.slice(0, 1010)}...`

                Embed.fields[1] = {
                    name: 'Translate',
                    value: `\`\`\`txt\n${res.text}\n\`\`\``
                }

                Embed.footer = { text: `Translated from ${Languages[res.from.language.iso] || 'WTF?'} to ${Languages[formatedLocale]}` }

                return await interaction.editReply({
                    embeds: [Embed],
                    ephemeral
                }).catch(() => { })

            })
            .catch(async err => {

                let errText = `${err}`

                if (!errText.length > 1013)
                    errText = `${errText.slice(0, 1010)}...`

                Embed.color = client.red
                Embed.fields[1] = {
                    name: 'Erro',
                    value: `\`\`\`txt\n${errText}\n\`\`\``
                }

                return await interaction.editReply({
                    embeds: [Embed],
                    ephemeral
                }).catch(() => { })
            })
    }
}