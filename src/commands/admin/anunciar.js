import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
  name: "anunciar",
  description: "〔🛠 Admin〕 Anuncia algo.",
  type: ApplicationCommandOptionType.Subcommand,
  dm_permission: false,
  options: [
    {
      name: 'canal',
      description: 'Qual canal o anúncio será enviado?',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "mensagem",
      description: "O que vai ser anúnciado?",
      type: ApplicationCommandOptionType.String,
      required: true,
    }
  ],

  run: async (client, interaction, args) => {
    const channel = interaction.options.getChannel("canal");
    const mensagem = interaction.options.getString("mensagem");

    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageMessages) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({
        content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageMessages}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
        ephemeral
      })
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      interaction.reply({
        content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
        ephemeral
      })
    } else {

      interaction.reply({
        content: `${e.Ok} | Anúncio enviado com sucesso!`,
        ephemeral
      })

      await channel.send({
        content: mensagem
      })

    }
  }
}