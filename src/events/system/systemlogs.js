import { WebhookClient } from 'discord.js'
import { createRequire } from 'node:module'

const webhook = new WebhookClient({ url: `${process.env.WEBHOOK_LOGS}` })
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

async function Readylogs() {
    await webhook.send({
        avatarURL: `https://media.discordapp.net/attachments/1030298443664597052/1071463846935547934/satelite.png?ex=65d0db77&is=65be6677&hm=d3879aacdbc848a16052d1cda149a3407b854cb75036d4aeb25ef4b50c435516&=&format=webp&quality=lossless&width=384&height=384`,
        content: `${e.Ok} | Reiniciamento concluido!\n📅 | ${new Date().toLocaleString("pt-BR").replace(" ", " ás ")}`
    })
}

async function SlashCommandsLoaded() {
    await webhook.send({
        avatarURL: `https://media.discordapp.net/attachments/1030298443664597052/1071463846935547934/satelite.png?ex=65d0db77&is=65be6677&hm=d3879aacdbc848a16052d1cda149a3407b854cb75036d4aeb25ef4b50c435516&=&format=webp&quality=lossless&width=384&height=384`,
        content: `${e.Ok} | Slash Commands Loaded!!`
    })
}

async function EventsLoaded() {
    await webhook.send({
        avatarURL: `https://media.discordapp.net/attachments/1030298443664597052/1071463846935547934/satelite.png?ex=65d0db77&is=65be6677&hm=d3879aacdbc848a16052d1cda149a3407b854cb75036d4aeb25ef4b50c435516&=&format=webp&quality=lossless&width=384&height=384`,
        content: `${e.Ok} | Events Loaded!`
    })
}
async function DatabaseLoaded() {
    await webhook.send({
        avatarURL: `https://media.discordapp.net/attachments/1030298443664597052/1071463846935547934/satelite.png?ex=65d0db77&is=65be6677&hm=d3879aacdbc848a16052d1cda149a3407b854cb75036d4aeb25ef4b50c435516&=&format=webp&quality=lossless&width=384&height=384`,
        content: `${e.Ok} | DataBase Loaded!`
    })
}
export {
    Readylogs,
    SlashCommandsLoaded,
    EventsLoaded,
    DatabaseLoaded
}