import client from '../client.js'
import { InteractionType } from 'discord.js';
import interactionButtonverification from '../events/verificationbutton.js'
import TicketHandler from '../events/ticket/ticketCreate.js';
const ticketHandler = new TicketHandler(client);

client.on('interactionCreate', async interaction => {
   client.interactions++

   if (interaction.isButton()) {
      if (interaction.customId.includes(`{`)) {
         const data = JSON.parse(interaction.customId)
         if (data.key == 'ping') return client.slashCommands.get('ping').run(client, interaction, true)
      }
      await ticketHandler.handleButton(interaction);
      interactionButtonverification(interaction);
   }
   if (interaction.isAnySelectMenu()) {
      await ticketHandler.handleSelectMenu(interaction)
   }


   if (interaction.type === InteractionType.ApplicationCommand) {

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      cmd.run(client, interaction)
   }
});


