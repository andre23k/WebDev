import { discloud } from 'discloud.app'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../../../JSON/emojis.json")

export default async interaction => {

    await interaction.reply({
        content: `${e.Load} | Solicitando start do client a Discloud Host...`,
        fetchReply: true
    })

    const response = await discloud.apps.start('1708292440198')

    if (!response)
        return await interaction.editReply({
            content: `${e.Saphire_recusado} | Não foi possível concluir o start.`
        })

    return await interaction.editReply({
        content: `${e.Saphire_ok} | Inicialização solicitada com sucesso.`,
    }).catch(() => { })
}