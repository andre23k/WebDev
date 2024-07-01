import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { PermissionsTranslate } from "../../util/constants.js";
import Database from '../../database/Database.js'
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "deleteinvites",
    description: "〔🛠 Admin〕 Remova invites de um usuário!",
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
            description: "Quantos invites deseja remover desse usuário?",
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
                    content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                    ephemeral
                });
            }
    

            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | Você não tem permissão para usar este comando.`,
                    ephemeral
                });
            }

            let guild = await Database.Guild.findOne({ Id: interaction.guild.id });

            if (!guild) {
                return await interaction.reply({
                    content: `${e.Saphire_triste} | O servidor não está registrado no banco de dados.`,
                    ephemeral
                });
            }


            let userInvite = guild.invites.find(invite => invite.userid === userid);

            if (!userInvite || userInvite.count === 0) {
                return interaction.reply({
                    content: `${e.Saphire_triste} | O usuário <@${userid}> não tem convites registrados.`,
                    ephemeral
                });
            }


            if (invitesToRemove > userInvite.count) {
                return interaction.reply({
                    content: `${e.Saphire_recusado} | O usuário <@${userid}> só possui ${userInvite.count} invites.`,
                    ephemeral
                });
            }

            userInvite.count -= invitesToRemove;

            await guild.save();


            await interaction.reply({
                content: `${e.Saphire_ok} | Foram removidos ${invitesToRemove} convites do usuário <@${userid}>.`,
                ephemeral
            });

        } catch (err) {
            console.error('Erro ao executar comando deleteinvites:', err);
            await interaction.reply({
                content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`,
                ephemeral
            });
        }
    }
}
