import moment from 'moment';
import { ButtonStyle, PermissionFlagsBits } from 'discord.js';
import discordTranscripts from 'discord-html-transcripts';
import { createRequire } from 'node:module'
import { BitColors } from '../../../util/constants.js';
import { leaveTicket } from './leaveticket.js';
const require = createRequire(import.meta.url)
const { e } = require("../../../JSON/emojis.json")

export async function handleTicketClose(interaction) {
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await closeTicket(interaction);
    } else {
        await leaveTicket(interaction);
    }
}

async function closeTicket(interaction) {
    await interaction.reply({
        content: `${e.Load} | Tem certeza que deseja encerrar esse ticket?...`,
        components: [{
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Confirmar',
                    emoji: e.Ok,
                    custom_id: 'confirmar_close',
                    style: ButtonStyle.Danger
                },
            ]
        }]
    });

    const filter = (i) => i.customId === 'confirmar_close' && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (i) => {
        await interaction.editReply({
            content: `${e.Load} | Encerrando o ticket...`,
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

            const logchannel = interaction.client.channels.getById('1165706306573832212');
            if (!logchannel) return;

            await logchannel.send({
                embeds: [{
                    color: BitColors.Red,
                    author: {
                        name: `${interaction.guild.name || `Not Found`}`,
                        icon_url: interaction.guild.iconURL({ dynamic: true }) || undefined,
                    },
                    fields: [
                        {
                            name: '🎫 | Quem Fechou',
                            value: `${interaction.user || `Not Found`}, \`${interaction.user.id || `Not Found`}\``,
                        },
                        {
                            name: `🎫 | Nome do ticket:`,
                            value: `\`${interaction.channel.name || `Not Found`}\``,
                        },
                        {
                            name: `📅 | Data:`,
                            value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
                        }
                    ],
                }],
                files: [attachment]
            }).catch((err) => console.log(err));

            await interaction.channel.delete().catch(() => null);
        }, 5000);
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            await interaction.deleteReply().catch(() => null);
        }
    });
}
