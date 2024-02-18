import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import * as discloud from './functions/discloud/functions.discloud.js';
import { PermissionsTranslate } from "../../util/constants.js"
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { e } = require("../../JSON/emojis.json")
const authorizedUserIds = ['1109893689666457620', '648389538703736833'];

export default {
    name: 'discloud',
    name_localizations: { "en-US": "discloud", 'pt-BR': 'host' },
    description: '〔🛠 Admin〕 Comandos da Discloud Host',
    dm_permission: false,
    type: 1,
    options: [
        {
            name: 'options',
            description: 'Opções do comando',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Reiniciar aplicação',
                    value: 'restart'
                },
                {
                    name: 'Inicializar aplicação',
                    value: 'start'
                },
            ]
        }
    ],
    run: async (client, interaction, args) => {
        if (!authorizedUserIds.includes(interaction.user.id)) {
            return interaction.reply({
                content: `${e.Saphire_recusado} | Apenas usuários autorizados podem usar esse comando.`,
                ephemeral: true
            });
        }
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            interaction.reply({
                content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                ephemeral: true
            })
        } else {
            const { options } = interaction
            const query = options.getString('options')
            const func = discloud[query]
            if (func) return func(interaction)

            return await interaction.reply({
                content: `${e.Saphire_recusado} | ID da OPTION não encontrado ou sem função definida.`,
                ephemeral: true
            })
        }
    }
}