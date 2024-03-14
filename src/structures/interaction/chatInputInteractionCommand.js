import client from '../../client.js'
import { InteractionType } from "discord.js";
export default async function ChatInputInteractionCommand(interaction){
    if (interaction.type === InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);
  
        if (!cmd) return interaction.reply(`Error`);
  
        cmd.run(client, interaction)
     }
}