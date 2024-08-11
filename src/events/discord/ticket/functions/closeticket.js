import moment from 'moment';
import { ButtonStyle, PermissionFlagsBits } from 'discord.js';
import discordTranscripts from 'discord-html-transcripts';
import { createRequire } from 'node:module'
import { BitColors } from '../../../../util/constants.js';
import { leaveTicket } from './leaveticket.js';
import Database from '../../../../database/Database.js';
import client from '../../../../core/client.js'
const require = createRequire(import.meta.url)
const { e } = require("../../../../JSON/emojis.json")

export async function handleTicketClose(interaction) {
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await closeTicket(interaction);
    } else {
        await leaveTicket(interaction);
    }
}

async function closeTicket(interaction) {
    await interaction.reply({
        content: `${e.Load} | Are you sure you want to close this ticket?...`,
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Confirm',
                    emoji: e.Ok,
                    custom_id: 'confirmar_close',
                    style: ButtonStyle.Danger
                },
            ]
        }]
    });

    return interaction.channel.createMessageComponentCollector({
        filter: i => i.customId === 'confirmar_close' && i.user.id === interaction.user.id,
        time: 15000
    })
        .on('collect', async i => {
            await interaction.editReply({
                content: `${e.Load} | Closing the ticket...`,
                components: []
            });
            setTimeout(async () => {
                const channel = interaction.channel;
                const attachment = await discordTranscripts.createTranscript(channel, {
                    limit: 1000,
                    returnType: 'attachment',
                    filename: `logs_${channel.name}.html`,
                    saveImages: false,
                    poweredBy: true
                });
                const data = await Database.Guild.findOne({ guildId: interaction.guild.id });
                if (!data) return;

                const channellog = client.channels.cache.get(data.ticket.channellog);
                if (channellog)
                await channellog.send({
                    embeds: [{
                        color: BitColors.Red,
                        author: {
                            name: `${interaction.guild.name || `Not Found`}`,
                            icon_url: interaction.guild.iconURL({ dynamic: true }) || undefined,
                        },
                        fields: [
                            {
                                name: '🎫 | Who Closed',
                                value: `${interaction.user || `Not Found`}, \`${interaction.user.id || `Not Found`}\``,
                            },
                            {
                                name: `🎫 | Ticket Name:`,
                                value: `\`${interaction.channel.name || `Not Found`}\``,
                            },
                            {
                                name: `📅 | Date:`,
                                value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
                            }
                        ],
                    }],
                    files: [attachment]
                }).catch((err) => console.log(err));

                await interaction.channel.delete().catch(() => null);
            }, 5000);
        })

        .on('end', async (collected, reason) => {
            if (reason === 'time') {
                await interaction.deleteReply().catch(() => null);
            }
        });
}
