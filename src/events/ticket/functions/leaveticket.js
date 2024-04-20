import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../../JSON/emojis.json")

export async function leaveTicket(interaction) {
    const userid = interaction.channel.topic
    if (!interaction.channel.topic) return;
    if (interaction.user.id !== userid) {
        await interaction.reply({
            content: `${e.Saphire_recusado} | Somente o <@${userid || `Not Foud`}> pode fechar esse ticket!`,
            ephemeral: true
        })
    }
    // const modalinteraction = {
    //     title: '',
    //     custom_id: '',
    //     components: [
    //         {
    //             type: 1,
    //             components: [
    //                 {
    //                     type: 4,
    //                     custom_id: "",
    //                     label: "",
    //                     style: 1,
    //                     min_length: 0,
    //                     max_length: 0,
    //                     placeholder: "",
    //                     value: '',
    //                     required: false
    //                 }
    //             ]
    //         },
    //         {
    //             type: 1,
    //             components: [
    //                 {
    //                     type: 4,
    //                     custom_id: "",
    //                     label: '',
    //                     style: 1,
    //                     min_length: 0,
    //                     max_length: 0,
    //                     placeholder: '',
    //                     value: "",
    //                     required: true
    //                 }
    //             ]
    //         }, // MAX: 5 Fields
    //     ]
    // };
    // await interaction.showModal(modalinteraction)
    await interaction.reply({ content: `${e.Ok} | Ticket fechado com sucesso.`, ephemeral: false })
    await interaction.channel.setTopic('').catch(() => null)
    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false },).catch(async err => {
        await interaction.editReply({ content: `${e.Error} | Houve um erro ao fechar seu ticket.\n${err}` })
    })
}
