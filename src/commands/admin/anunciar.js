import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
  name: "anunciar",
  description: "〔🛠 Admin〕 Announce something.",
  type: ApplicationCommandOptionType.Subcommand,
  dm_permission: false,
  options: [
    {
      name: 'canal',
      description: 'What channel will the ad be sent to?',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "mensagem",
      description: "What will be announced?",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction, args) => {
    const channel = interaction.options.getChannel("canal");
    const mensagem = interaction.options.getString("mensagem");

    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageMessages) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageMessages}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
        ephemeral
      })
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      interaction.reply({
        content: `${e.Saphire_recusado} | You do not have permission to use this command.`,
        ephemeral
      })
    } else {

      interaction.reply({
        content: `${e.Ok} | Ad sent successfully!`,
        ephemeral
      })

      await channel.send({
        content: mensagem
      })

    }
  }
}