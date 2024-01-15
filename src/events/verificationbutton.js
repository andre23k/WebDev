import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../JSON/emojis.json");

export default async function interactionButtonVerification(interaction, client) {
  try {
    if (interaction.customId === "verificar") {

      if (!interaction.guild || !interaction.member) {
        await interaction.reply({
          content: "Erro ao processar a verificação. Por favor, tente novamente mais tarde ou entre em contato com os administradores do servidor.",
          ephemeral: true,
        });
        return;
      }

      const memberId = interaction.user.id;
      const member = interaction.guild.members.cache.get(memberId);


      const role = interaction.guild.roles.cache.get('1116828474003423362');
      if (!role || (member && member.roles.cache.has(role.id))) {
        await interaction.reply({
          content: `Você já foi verificado anteriormente ou já possui acesso ao servidor.`,
          ephemeral: true,
        });
        return;
      }


      await member.roles.add(role.id, "Verificação");

      await interaction.reply({
        content: `Olá, ${interaction.user.username}! Você foi verificado e agora tem acesso ao servidor.`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Desculpe, ocorreu um erro ao processar sua verificação. Por favor, tente novamente mais tarde ou entre em contato com os administradores do servidor.",
      ephemeral: true,
    });
  }
}
