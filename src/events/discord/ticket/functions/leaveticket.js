import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../../../JSON/emojis.json")

export async function leaveTicket(interaction) {
    const userid = interaction.channel.topic
    if (!interaction.channel.topic) return;
    if (interaction.user.id !== userid) {
        await interaction.reply({
            content: `${e.Saphire_recusado} | Only <@${userid || `Not Foud`}> can close this ticket!`,
            ephemeral
        })
    }
    await interaction.reply({ content: `${e.Ok} | Ticket closed successfully.`, ephemeral: false })
    await interaction.channel.setTopic('').catch(() => null)
    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false },).catch(async err => {
        await interaction.editReply({ content: `${e.Error} | There was an error closing your ticket.\n${err}` })
    })
}
