import client from '../../client.js'
import { BitColors } from '../../util/constants.js'
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

client.on('guildMemberAdd', async member => {
  client.events++
  if (member.guild.id !== "993634908377464912")
    return;
  let channel = await client.channels.fetch('1195133949610045460')
  channel.send({
    embeds: [{
      title: `Entrou no servidor!`,
      color: BitColors.DarkRed,
      description: `${e.Ids} **Membro:** ${member}\n⠀ ${e.Ids} **ID:**\`${member.user.id}\`\n⠀ ${e.Ids} **Tag:**\`${member.user.tag}\` `,
      author: ({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }),
      thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true }) || null }
    }]
  })


})



