import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from "discord.js";
import { PermissionsTranslate } from '../../util/constants.js';
import { createRequire } from 'node:module';
import Database from "../../database/Database.js";
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "ticket",
    description: "〔🛠 Admin〕 Ativa o painel de ticket.",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'channel-config',
            description: 'Para qual canal o ticket vai?',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "category-ticket",
            description: "Qual categoria o ticket será criado?",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildCategory],
            required: true,
        },
        {
            name: "roles-moderation",
            description: "Quais cargos deseja colocar para atender e administrar o ticket?",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: "channel-log",
            description: "Para qual canal os logs dos tickets serão enviados?",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
    ],

    run: async (client, interaction, args) => {
        const ChannelConfigId = interaction.options.getChannel('channel-config')?.id;
        const ChannelLogId = interaction.options.getChannel('channel-log')?.id;
        const RolesModeration = interaction.options.getRole('roles-moderation')?.id;
        const CategoryId = interaction.options.getChannel("category-ticket");
        const guildId = interaction.guild.id;

        if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels) || !interaction.guild.members.me?.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: `${e.Saphire_recusado} | Eu preciso da permissão **\`${PermissionsTranslate.ManageChannels}\`** e **\`${PermissionsTranslate.Administrator}\`** para executar este comando.`,
                ephemeral
            });
        }

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: `${e.Saphire_recusado} | Você não tem permissão pra usar esse comando.`,
                ephemeral
            });
        }

        try {
            await Database.Guild.findOneAndUpdate(
                { Id: guildId },
                {
                    $set: {
                        'ticket.channelconfig': ChannelConfigId,
                        'ticket.channellog': ChannelLogId,
                        'ticket.categoryId': CategoryId,
                        'ticket.rolemodId': RolesModeration
                    }
                },
                { upsert: true, new: true }
            );

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
                            value: 'ajuda',
                        },
                    ]
                }]
            };

            await interaction.reply({
                content: `${e.Saphire_ok} | Ticket ativado com sucesso!`,
                ephemeral
            });

            const channelConfig = client.channels.cache.get(ChannelConfigId);
            if (channelConfig)
                return await channelConfig.send({
                    embeds: [{
                        author: { name: "Criar Ticket" },
                        color: 0x2f3136,
                        description: `Para criar um ticket, selecione o tópico que você precisa na seleção abaixo.`,
                        thumbnail: {
                            url: `https://media.discordapp.net/attachments/1194433381019164682/1195792969010266302/6b7280b1f7c377f6773f5b81b9bb49bf.png?ex=65b547fc&is=65a2d2fc&hm=1a0f2e0a46f87e080bc293e448a6c401da54e64d036e3246c7a4c8199469c975&=&format=webp&quality=lossless&width=54&height=54`
                        }
                    }],
                    components: [selectMenu]
                });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `${e.Saphire_recusado} | Ocorreu um erro ao configurar o painel de ticket. Por favor, tente novamente mais tarde.`,
                ephemeral
            });
        }
    }
};
