import moment from 'moment';
import client from '../../../client.js'
import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import discordTranscripts from 'discord-html-transcripts';
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../../JSON/emojis.json")

export default async function handleTicketClose(interaction) {
    if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await closeTicket(interaction);
    } else {
        await leaveTicket(interaction);
    }
}

async function closeTicket(interaction) {
    await interaction.reply({ content: `${e.Load} | O ticket será encerrado em 10 segundos.`, ephemeral: false, fetchReply: true }).then(() => {
        setTimeout(async () => {
            const channel = interaction.channel;
            const attachment = await discordTranscripts.createTranscript(channel, {
                limit: 1000,
                returnType: 'attachment',
                filename: `logs_${channel.name}.html`,
                saveImages: false,
                poweredBy: true
            });

            const logchannel = client.channels.cache.get('1165706306573832212');

            let embedclose = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    {
                        name: `🎫 | Quem Fechou`,
                        value: `${interaction.user || `Not Found`}, \`${interaction.user.id || `Not Found`}\``,
                        inline: false
                    },
                    {
                        name: `🎫 | Nome do ticket:`,
                        value: `\`${interaction.channel.name || `Not Found`}\``,
                        inline: false
                    },
                    {
                        name: `📅 | Data:`,
                        value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
                        inline: false
                    }
                )

            await logchannel.send({
                embeds: [embedclose],
                files: [attachment]
            });

            await interaction.channel.delete();

        }, 10 * 1000);

    });
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
