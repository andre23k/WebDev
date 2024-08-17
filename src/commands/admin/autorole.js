import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
    name: "autorole",
    description: "〔🛠 Admin〕 Active System Autorole. ",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'roleid',
            description: 'What is the role?',
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    run: async (client, interaction, args) => {
        const roleid = interaction.options.getRole("roleid")?.id;
        const guildId = interaction.guild.id;

        if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageRoles}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
                ephemeral
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: `${e.Saphire_recusado} | You do not have permission to use this command.`,
                ephemeral
            });
        }
        try {
            await Database.Guild.findOneAndUpdate(
                { Id: guildId },
                {
                    $set: {
                        "autorole.roleId": roleid,
                        "autorole.activeEvent": true,
                    }
                },
                { upsert: true, new: true }
            )
            await interaction.reply({
                content: `${e.Saphire_ok} | System Actived!`,
                ephemeral
            })
        } catch (err) {
            console.error(err)
            await interaction.editReply({
                content: `${e.Saphire_triste} | An error occurred while executing this command!`
            })
        }

    }
}