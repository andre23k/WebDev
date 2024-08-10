import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { PermissionsTranslate } from "../../util/constants.js";
import Database from '../../database/Database.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "infoinvites",
    description: "〔⚙️ Utilidade〕 See how many invites a user has!",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'user',
            description: 'Which user?',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction, args) => {
        const userid = interaction.options.getUser('user').id || interaction.user.id;
        try {
            const guildId = interaction.guild.id;
            
            const guildData = await Database.Guild.findOne({ Id: guildId });
            
            await interaction.reply({
                content: `${e.Load} | Okay, just a second..`,
            });

            if (guildData) {
                const userInvite = guildData.invites.find(invite => invite.userid === userid);
                
                if (userInvite) {
                    await interaction.editReply({
                        content: `${e.Saphire_wow} | User <@${userid}> has ${userInvite.count} invites!`
                    });
                } else {
                    await interaction.editReply({
                        content: `${e.Saphire_triste} | User has no invites registered!`
                    });
                }
            } else {
                await interaction.editReply({
                    content: `${e.Saphire_triste} | The server is not registered in the database.`
                });
            }
        } catch (err) {
            console.error('Erro ao executar comando infoinvites:', err);
            await interaction.editReply({
                content: `${e.Saphire_triste} | An error occurred while executing this command!`
            });
        }
    }
}
