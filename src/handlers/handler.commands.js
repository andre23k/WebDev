import fs from 'fs';
import { Routes } from "discord.js";
import client from '../client.js';
import { SlashCommandsLoaded } from '../events/logs/systemlogs.js'
export default async () => {
    const SlashsArray = [];
    const subfolders = fs.readdirSync(`src/commands/`);

    for (const subfolder of subfolders) {
        const files = fs.readdirSync(`src/commands/${subfolder}/`);
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            const commandfile = await import(`../commands/${subfolder}/${file}`);
            const command = commandfile.default;
            if (!command?.name) continue;
            client.slashCommands.set(command.name, command);
            SlashsArray.push(command);
        }
    }
    await client.rest.put(
        Routes.applicationCommands(client.user.id),
        { body: SlashsArray },
    );
    await SlashCommandsLoaded()
    console.log(`${client.slashCommands.size} SlashCommands | OK!`);
}
