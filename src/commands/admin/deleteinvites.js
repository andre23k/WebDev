import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { PermissionsTranslate } from "../../util/constants.js";
import Database from '../../database/Database.js'
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "deleteinvites",
    description: "〔🛠 Admin〕 Remove invites from a user!",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'user',
            description: 'Which user?',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "invites",
            description: "How many invites do you want to remove from this user?",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction, args) => {
        const userid = interaction.options.getUser('user')?.id;
        const invitesToRemove = interaction.options.getNumber('invites');

        try {
            if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
                    ephemeral
                });
            }
    

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | You do not have permission to use this command.`,
                    ephemeral
                });
            }

            let guild = await Database.Guild.findOne({ Id: interaction.guild.id });

            if (!guild) {
                return await interaction.reply({
                    content: `${e.Saphire_triste} | Server is not registered in the database.`,
                    ephemeral
                });
            }


            let userInvite = guild.invites.find(invite => invite.userid === userid);

            if (!userInvite || userInvite.count === 0) {
                return interaction.reply({
                    content: `${e.Saphire_triste} | The user <@${userid}> has no registered invitations.`,
                    ephemeral
                });
            }


            if (invitesToRemove > userInvite.count) {
                return interaction.reply({
                    content: `${e.Saphire_recusado} | User <@${userid}> only has ${userInvite.count} invites.`,
                    ephemeral
                });
            }

            userInvite.count -= invitesToRemove;

            await guild.save();


            await interaction.reply({
                content: `${e.Saphire_ok} | Removed ${invitesToRemove} invitations from user <@${userid}>.`,
                ephemeral
            });

        } catch (err) {
            console.error('Erro ao executar comando deleteinvites:', err);
            await interaction.reply({
                content: `${e.Saphire_triste} | An error occurred while executing this command!.`,
                ephemeral
            });
        }
    }
}
