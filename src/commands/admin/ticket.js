import { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits } from "discord.js";
import { PermissionsTranslate } from '../../util/constants.js';
import { createRequire } from 'node:module';
import Database from "../../database/Database.js";
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "ticket",
    description: "〔🛠 Admin〕 Activates the ticket panel.",
    type: ApplicationCommandOptionType.Subcommand,
    dm_permission: false,
    options: [
        {
            name: 'channel-config',
            description: 'Which channel does the ticket go to?',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "category-ticket",
            description: "What category will the ticket be created in?",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildCategory],
            required: true,
        },
        {
            name: "roles-moderation",
            description: "What roles do you want to assign to answer and manage the ticket?",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
        {
            name: "channel-log",
            description: "Which channel will ticket logs be sent to?",
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
                content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageChannels}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
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
                    placeholder: 'Choose category:',
                    options: [
                        {
                            label: 'Request Support',
                            emoji: e.Seguro,
                            value: 'support',
                        },
                        {
                            label: 'Send suggestion',
                            emoji: e.Saphire_dance,
                            value: 'suggestion',
                        },
                        {
                            label: 'Appeal a punishment',
                            emoji: e.Ban,
                            value: 'punishment',
                        },
                        {
                            label: 'Make a complaint',
                            emoji: e.Saphire_Stonks,
                            value: 'complaint',
                        },
                        {
                            label: 'My option is not here! Help me!',
                            emoji: '❓',
                            value: 'help',
                        },
                    ]
                }]
            };

            await interaction.reply({
                content: `${e.Saphire_ok} | Ticket activated successfully!`,
                ephemeral
            });

            const channelConfig = client.channels.cache.get(ChannelConfigId);
            if (channelConfig)
                return await channelConfig.send({
                    embeds: [{
                        author: { name: "Create Ticket" },
                        color: 0x2f3136,
                        description: `To create a ticket, select the topic you need from the selection below..`,
                        thumbnail: {
                            url: `https://media.discordapp.net/attachments/1012919673840484382/1271938526992269354/dev.jpg?ex=66b92890&is=66b7d710&hm=7728d801e3c706fa247ee96cb0e0e0592e67ee17ff71deb6298a689f1b0d0ba9&=&format=webp&width=72&height=72`
                        }
                    }],
                    components: [selectMenu]
                });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `${e.Saphire_recusado} | An error occurred while configuring the ticket panel. Please try again later.`,
                ephemeral
            });
        }
    }
};
