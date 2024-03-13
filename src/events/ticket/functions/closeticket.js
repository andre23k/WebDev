import moment from 'moment';
import { PermissionFlagsBits } from 'discord.js';
import discordTranscripts from 'discord-html-transcripts';
import { createRequire } from 'node:module'
import { BitColors } from '../../../util/constants.js';
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
        content: `${e.Load} | Encerrando o ticket...`
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

        const logchannel = interaction.client.channels.cache.get('1165706306573832212');
        if (!logchannel) return;

        await logchannel.send({
            embeds: [{
                color: BitColors.Red,
                author: {
                    name: `${interaction.guild.name || `Not Found`}`,
                    icon_url: `${interaction.guild.iconURL({ dynamic: true })}`,
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
        }).catch(() => null);

        await interaction.channel.delete().catch(() => null);
    }, 5000);
}


async function leaveTicket(interaction) {
    const userid = interaction.channel.topic
    if (!interaction.channel.topic) return;
    if (interaction.user.id !== userid) {
        await interaction.reply({
            content: `${e.Saphire_recusado} | Somente o <@${userid || `Not Foud`}> pode fechar esse ticket!`,
            ephemeral: true
        })
    }

    await interaction.reply({ content: `${e.Ok} | Ticket fechado com sucesso.`, ephemeral: false })
    await interaction.channel.setTopic('').catch(() => null)
    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false },).catch(async err => {
        await interaction.editReply({ content: `${e.Error} | Houve um erro ao fechar seu ticket.\n${err}` })
    })
}
