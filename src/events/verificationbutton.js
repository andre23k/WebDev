import { BitColors } from '../util/constants.js';
import moment from 'moment';
import client from '../client.js';
import { createRequire } from 'node:module';
import Database from '../database/Database.js';
const require = createRequire(import.meta.url);
const { e } = require("../JSON/emojis.json");

export default async function interactionButtonVerification(interaction) {
  try {
    if (!interaction.guild || !interaction.member) {
      await interaction.reply({
        content: "Erro ao processar a verificação. Por favor, tente novamente mais tarde ou entre em contato com os administradores do servidor.",
        ephemeral
      });
      return;
    }

    const memberId = interaction.user.id;
    const member = interaction.guild.members.cache.get(memberId);
    const data = await Database.Verification.findOne({ guildId: interaction.guild.id })

    const role = interaction.guild.roles.cache.get(data.roleverifcationId);
    if (!role || (member && member.roles.cache.has(role.id))) {
      await interaction.reply({
        content: `Você já foi verificado anteriormente ou já possui acesso ao servidor.`,
        ephemeral,
      });
      return;
    }
    const channellog = client.channels.cache.get(data.channellog);

    await member.roles.add(role.id, "Verificação");

    await interaction.reply({
      content: `Olá, ${interaction.user.username}! Você foi verificado e agora tem acesso ao servidor.`,
      ephemeral
    }).then(async () => await channellog.send({
      embeds: [{
        title: `Checking System logs`,
        color: BitColors.DarkRed,
        author: ({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }),
        thumbnail: { url: interaction.user.displayAvatarURL({ forceStatic: true }) || null },
        fields: [
          {
            name: `${e.Users} | User:`,
            value: `${interaction.user || `Not Foud`} (\`${interaction.user.id || `Not Foud`}\`)`,
          },
          {
            name: `📅 | Data:`,
            value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
          }
        ]
      }]
    })).catch(async () => await interaction.editReply({
      content: `${e.Saphire_triste} | Ocorreu um erro ao se verificar.`,
      ephemeral: true
    }))



  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: "Desculpe, ocorreu um erro ao processar sua verificação. Por favor, tente novamente mais tarde ou entre em contato com os administradores do servidor.",
      ephemeral,
    });
  }
}