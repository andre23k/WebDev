import { PermissionFlagsBits } from "discord.js"
import { PermissionsTranslate } from '../../util/constants.js'
import ticketcreate from "../../events/ticketCreate.js"
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")

export default {
    name: "ticket",
    description: "〔🛠 Admin〕 Ativa o painel de ticket.",

    run: async (client, interaction, args) => {
        if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator))
            return interaction.reply({
                content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageChannels}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                ephemeral: true
            })
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            interaction.reply({
                content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                ephemeral: true
            })
        } else {
            const selectMenu = {
                type: 1,
                components: [{
                    type: 3,
                    custom_id: 'menu',
                    placeholder: 'Escolha a categoria:',
                    options: [
                        {
                            label: 'Pedir Suporte',
                            emoji: e.Seguro,
                            value: 'support',
                        },
                        {
                            label: 'Enviar sugestão',
                            emoji: e.Saphire_dance,
                            value: 'sugestão',
                        },
                        {
                            label: 'Apelar uma punição',
                            emoji: e.Ban,
                            value: 'punição',
                        },
                        {
                            label: 'Fazer denúncia',
                            emoji: e.Saphire_Stonks,
                            value: 'denúncia',
                        },
                        {
                            label: 'Minha opção não está aqui! Me ajuda!',
                            emoji: '❓',
                            value: 'opção',
                        },
                    ]
                }]
            }

            interaction.channel.send({
                embeds: [{
                    author: ({ name: "Criar Ticket" }),
                    color: 0x2f3136,
                    description: `Para criar um ticket, selecione o tópico que você precisa na seleção abaixo..`,
                    thumbnail:{
                        url:`https://media.discordapp.net/attachments/1194433381019164682/1195792969010266302/6b7280b1f7c377f6773f5b81b9bb49bf.png?ex=65b547fc&is=65a2d2fc&hm=1a0f2e0a46f87e080bc293e448a6c401da54e64d036e3246c7a4c8199469c975&=&format=webp&quality=lossless&width=54&height=54`
                    }
                }],
                components: [selectMenu]

            })
            ticketcreate(interaction)

        }
    }
}