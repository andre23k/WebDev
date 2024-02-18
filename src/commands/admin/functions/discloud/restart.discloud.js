import { createRequire } from 'node:module'
import { discloud } from 'discloud.app'
const require = createRequire(import.meta.url)
const { e } = require("../../../../JSON/emojis.json")

export default async interaction => {
    await interaction.reply({
        content: `${e.Load} | Soliciantando reiniciamento...`
    })
    await interaction.editReply({
        content: `${e.Ok} | Reiniciamento foi solicitado!`,
    })
        .then(async () => { await discloud.apps.restart('1708292440198') })
        .catch(async(err) => { 
            console.log(err); 
            await interaction.editReply({
                content:`${e.Saphire_triste} | Ocorreu um erro ao reiniciar essa aplicação!`
            });
        })


}
