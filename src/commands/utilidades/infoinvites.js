import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")


export default {
  name: "infoinvites",
  description: "〔⚙️ Utilidade〕 Veja quantos invites um usuário tem!",
  type: ApplicationCommandOptionType.Subcommand,
  dm_permission: false,
  options: [
    {
      name: 'user',
      description: 'Qual usuário?',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction, args) => {
    const userid = interaction.options.getUser('user')?.id || interaction.user.id
    try {

      const data = await Database.Invite.findOne({ userid: userid })

      await interaction.reply({
        content: `${e.Load} | Ok, só um segundo..`,
      });

      if (data) {
        await interaction.editReply({
          content: `${e.Saphire_wow} | O usuário <@${userid}> tem ${data.count} invites!`
        });
      } else {
        await interaction.editReply({
          content: `${e.Saphire_triste} | O usuário não tem nenhum invite registrado!`
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.editReply({
        content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`
      })
    }
  }
}