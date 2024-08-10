import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
    name: "register",
    description: "〔🛠 Admin〕 Activate the member registration system.",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'welcome-system',
            description: 'On which channel will the bot send the welcome message?',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "invite-system",
            description: "On which channel will the bot send the invite message?",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    run: async (client, interaction, args) => {
        const Welcome = interaction.options.getChannel('welcome-system')?.id;
        const Invite = interaction.options.getChannel('invite-system')?.id;
        const guildid = interaction.guild.id;
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

            await interaction.reply({
                content: `${e.Anya_pulo} | Registration system successfully activated on server!`,
                ephemeral
            })

            await Database.Guild.findOneAndUpdate(
                { Id: guildid },
                {
                    $set: {
                        'register.welcomechannelId': Welcome,
                        'register.invitechannelId': Invite,
                        'register.activeEvent': true,
                    }
                },
                { upsert: true, new: true }
            );
        } catch (err) {
            await interaction.reply({
                content: `${e.Desespero} | An error occurred while executing this command!. `, err,
                ephemeral
            })
        }
    }
}
