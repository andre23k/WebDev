import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { PermissionsTranslate } from "../../util/constants.js";
import { createRequire } from 'node:module';
import Database from '../../database/Database.js';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "addinvites",
    description: "〔🛠 Admin〕 Adiciona invites a um usuário!",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'user',
            description: 'Qual usuário?',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "invites",
            description: "Quantos invites deseja adicionar ao usuário?",
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
                    content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                    ephemeral
                });
            }

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({
                    content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
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
                content: `${e.Saphire_ok} | Adicionei com sucesso ${addedInvites} invites para <@${userId}>!\n${e.Saphire_rigth} | Valor anterior: ${oldInviteCount}\n${e.Saphire_wow} | Novo valor: ${newInviteCount}`,
                ephemeral
            });

        } catch (error) {
            console.error('Erro ao adicionar convites:', error);
            await interaction.reply({
                content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`,
                ephemeral
            });
        }
    }
};
