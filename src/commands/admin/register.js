import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
    name: "register",
    description: "〔🛠 Admin〕 Ative o sistema de registro dos membros.",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'welcome-system',
            description: 'Em qual canal o bot vai mandar a mensagem de boas vindas?',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "invite-system",
            description: "Em qual canal o bot vai mandar a mensagem de invites?",
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
                    content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                    ephemeral
                });
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                    ephemeral
                });
            }

            await interaction.reply({
                content: `${e.Anya_pulo} | Sistema de registro ativado com sucesso no servidor!`,
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
                content: `${e.Desespero} | Ocorreu um erro ao executar esse comando! `, err,
                ephemeral
            })
        }
    }
}
