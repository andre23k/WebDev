import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { PermissionsTranslate } from "../../util/constants.js";
import { createRequire } from 'node:module';
import Database from '../../database/Database.js';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "addinvites",
    description: "〔🛠 Admin〕 Add invite a user!",
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
            description: "How many invites do you want to add to the user?",
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1
        }
    ],

    run: async (client, interaction, args) => {
        const userId = interaction.options.getUser('user')?.id || interaction.user.id;
        const addedInvites = interaction.options.getNumber('invites');

        try {
            if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({
                    content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
                    ephemeral
                });
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({
                    content: `${e.Saphire_recusado} | You do not have permission to use this command.`,
                    ephemeral
                });
            }

            const guildId = interaction.guild.id;
            const userInviteData = await Database.Guild.findOne(
                { guildId: guildId, "invites.userid": userId },
                { "invites.$": 1 }
            );

            const oldInviteCount = userInviteData?.invites[0]?.count || 0;
            const newInviteCount = oldInviteCount + addedInvites;

            if (userInviteData) {
                await Database.Guild.updateOne(
                    { Id: guildId, "invites.userid": userId },
                    { $set: { "invites.$.count": newInviteCount } }
                );
            } else {
                await Database.Guild.findOneAndUpdate(
                    { Id: guildId },
                    { $push: { invites: { userid: userId, count: newInviteCount } } },
                    { upsert: true, new: true }
                );
            }

            await interaction.reply({
                content: `${e.Saphire_ok} | I successfully added ${addedInvites} invites for <@${userId}>!\n${e.Saphire_rigth} | Previous value: ${oldInviteCount}\n${e.Saphire_wow} | New value: ${newInviteCount}`,
                ephemeral
            });

        } catch (error) {
            console.error('Erro ao adicionar convites:', error);
            await interaction.reply({
                content: `${e.Saphire_triste} | An error occurred while executing this command!`,
                ephemeral
            });
        }
    }
};
