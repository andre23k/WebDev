import { ApplicationCommandType, PermissionFlagsBits, ButtonStyle, ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { PermissionsTranslate, BitColors } from '../../util/constants.js';
import { createRequire } from 'node:module';
import Database from '../../database/Database.js';
const require = createRequire(import.meta.url);
const { e } = require('../../JSON/emojis.json');

export default {
    name: "verificar",
    description: "〔🛠 Admin〕 Activate my verification system.",
    type: ApplicationCommandType.ChatInput,
    dm_permission: false,
    options: [
        {
            name: 'channel-config',
            description: 'Which channel does the verification system go to?',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "channel-log",
            description: "Which channel do the verification logs go to?",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "role-verification",
            description: "What position will be assigned to the members?",
            type: ApplicationCommandOptionType.Role,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        try {
            const ChannelConfigId = interaction.options.getChannel('channel-config')?.id;
            const ChannellogId = interaction.options.getChannel('channel-log')?.id;
            const Roleverification = interaction.options.getRole('role-verification')?.id;
            const guildId = interaction.guild.id;

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles) || !interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator))
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | I need permission **\`${PermissionsTranslate.ManageRoles}\`** e **\`${PermissionsTranslate.Administrator}\`** to execute this command.`,
                    ephemeral: true
                });


            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
                return await interaction.reply({
                    content: `${e.Saphire_recusado} | You do not have permission to use this command.`,
                    ephemeral: true
                });

            await Database.Guild.findOneAndUpdate(
                { Id: guildId },
                {
                    $set: {
                        'verification.channelconfig': ChannelConfigId,
                        'verification.channellog': ChannellogId,
                        'verification.roleverificationId': Roleverification
                    },
                },
                { upsert: true, new: true }
            );

            await interaction.reply({
                content: `${e.Saphire_ok} | Verification system has been successfully configured.`,
                ephemeral: true
            });

            const channelConfig = client.channels.cache.get(ChannelConfigId);
            if (channelConfig) {
                await channelConfig.send({
                    embeds: [{
                        title: `Verification System`,
                        description: `Click the button below to receive access to the server.`,
                        color: BitColors.Blue
                    }],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: `Check`,
                                    emoji: `${e.Ok}`,
                                    custom_id: `verificar`,
                                    style: ButtonStyle.Primary,
                                }
                            ]
                        }
                    ]
                });
            }
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: `${e.Desespero} | An error occurred while executing this command!`,
                ephemeral: true
            });
        }
    }
};
