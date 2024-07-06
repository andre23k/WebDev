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
    const data = await Database.Guild.findOne({ Id: interaction.guild.id });
    const role = interaction.guild.roles.cache.get(data.verification.roleverificationId);

    if (!role || (member && member.roles.cache.has(role.id))) {
      await interaction.reply({
        content: `${e.Saphire_recusado} | Você já foi verificado anteriormente ou já possui acesso ao servidor.`,
        ephemeral
      });
      return;
    }

    const channellog = client.channels.cache.get(data.verification.channellog);

    await member.roles.add(role.id, "Verificação");
    
    await interaction.reply({
      content: `${e.Saphire_ok} | Olá, ${interaction.user.username}! Você foi verificado e agora tem acesso ao servidor.`,
      ephemeral
    });

    await channellog.send({
      embeds: [{
        title: `Checking System logs`,
        color: BitColors.DarkRed,
        author: { name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) },
        thumbnail: { url: interaction.user.displayAvatarURL({ forceStatic: true }) || null },
        fields: [
          {
            name: `${e.Users} | User:`,
            value: `${interaction.user || `Not Found`} (\`${interaction.user.id || `Not Found`}\`)`,
          },
          {
            name: `📅 | Data:`,
            value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
          }
        ]
      }]
    });

  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: `${e.Desespero} | Desculpe, ocorreu um erro ao processar sua verificação. Por favor, tente novamente mais tarde ou entre em contato com os administradores do servidor.`,
      ephemeral
    });
  }
}
