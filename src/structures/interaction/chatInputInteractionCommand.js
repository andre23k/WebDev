import client from "../../core/client.js";
import { InteractionType } from "discord.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default async function ChatInputInteractionCommand(interaction) {
  try {
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: `${e.Saphire_triste} | Comando não encontrado.`,
        ephemeral
      });
      return;
    }

    await command.run(client, interaction);
  } catch (error) {
    console.error('Erro ao executar o comando:', error);
    await interaction.reply({
      content: `${e.Saphire_recusado} | Ocorreu um erro ao executar o comando.`,
      ephemeral
    });
  }
}
