import client from '../../core/client.js'
import HandleButton from '../../structures/interaction/buttoninteraction.js';
import HandleSelectMenu from '../../structures/interaction/selectMenuInteraction.js';
import ChatInputInteractionCommand from '../../structures/interaction/chatInputInteractionCommand.js';
import { sendInteractionErrorToDiscordWebhook } from '../../modules/errors/process/unhandledRejection.js'
import ModalInteractionCommand from '../../structures/interaction/modalInteractionCommand.js';

client.on('interactionCreate', async interaction => {
   client.interactions++
   try {
      if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) return await ChatInputInteractionCommand(interaction)
      if (interaction.isButton()) return await HandleButton(interaction);
      if (interaction.isAnySelectMenu()) return await HandleSelectMenu(interaction)
      if (interaction.isModalSubmit()) return await ModalInteractionCommand(interaction)
   } catch (error) {
      await sendInteractionErrorToDiscordWebhook(interaction, error)
   }
});