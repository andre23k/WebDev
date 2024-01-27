import { ApplicationCommandType, PermissionFlagsBits, ButtonStyle } from 'discord.js';
import { PermissionsTranslate, BitColors } from '../../util/constants.js'
import { createRequire } from 'node:module'
import interactionButtonverification from '../../events/verificationbutton.js'
const require = createRequire(import.meta.url)
const { e } = require('../../JSON/emojis.json')

export default {
    name: "verificar",
    description: "〔🛠 Admin〕 Ative meu sistema de verificação.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,

    run: async (client, interaction) => {
        let channel = await client.channels.fetch('1143559889428414616')

        if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator))
            return interaction.reply({
                content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageRoles}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                ephemeral: true
            })
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            interaction.reply({
                content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                ephemeral: true
            })    
        } else {

            await interaction.reply({
                content: `Sistema de verificação foi enviado com sucesso.`,
                ephemeral: true
            })

            channel.send({
                embeds: [{
                    title: `Sistema de verificação FiveM Portugal`,
                    description: `Clique no botão abaixo para receber acesso ao servidor.`,
                    color: BitColors.Blue
                }],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: `Verificar`,
                                emoji: `${e.Ok}`,
                                custom_id: `verificar`,
                                style: ButtonStyle.Primary,
                            }
                        ]
                    }
                ]
            })

            interactionButtonverification(interaction)
        }
    }
}