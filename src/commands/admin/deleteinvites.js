import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js"
import { PermissionsTranslate } from "../../util/constants.js"
import Database from '../../database/Database.js'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

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
            description: "Qauntos invites deseja remover desse usuário?",
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction, args) => {
        const userid = interaction.options.getUser('user')?.id || interaction.user.id
        const invitesToRemove = interaction.options.getNumber('invites')
        try {
            if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuild) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator))
                return interaction.reply({
                    content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageGuild}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                    ephemeral: true
                })
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                interaction.reply({
                    content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                    ephemeral: true
                })
            } else {
                const userInvites = await Database.Invite.findOne({ userid: userid });

                if (!userInvites) {
                    return interaction.reply({
                        content: `${e.Saphire_triste} | O usuário <@${userid}> não tem convites registrados.`,
                        ephemeral: true
                    });
                }

                if (invitesToRemove > userInvites.count) {
                    return interaction.reply({
                        content: `${e.Saphire_recusado} | O usuário <@${userid}> só possui ${userInvites.count} invites.`,
                        ephemeral: true
                    });
                }

                await Database.Invite.findOneAndUpdate(
                    { userid: userid },
                    { $inc: { count: -invitesToRemove } },
                    { new: true }
                );

                await interaction.reply({
                    content: `${e.Saphire_ok} | Foram removidos ${invitesToRemove} convites do usuário <@${userid}>.`,
                    ephemeral: true
                });
            }
        } catch (err) {
            console.log(err);
            await interaction.reply({
                content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`,
                ephemeral: true
            })
        }
    }
}