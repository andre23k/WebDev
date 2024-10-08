import { AuditLogEvent } from "discord.js";
import { BitColors, ChannelsTypes } from "../../../util/constants.js";
import { createRequire } from 'node:module';
import client from "../../../core/client.js";
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

client.on('channelDelete', async channel => {
    const { guild } = channel;
    const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete }).catch(() => null);
    if (!logs) return;
    const Log = logs.entries.first();
    if (!Log || Log.action !== AuditLogEvent.ChannelDelete) return;

    const { executor } = Log;


    const guildId = '1291872723026448445';
    const channelId = '1291888300394807317';


    const destinationGuild = client.guilds.cache.get(guildId);
    if (!destinationGuild) {
        console.error(`Não foi possível encontrar o servidor de destino com ID ${guildId}.`);
        return;
    }


    const logChannel = await destinationGuild.channels.fetch(channelId).catch(() => null);
    if (!logChannel) {
        console.error(`Não foi possível encontrar o canal de log com ID ${channelId} no servidor de destino.`);
        return;
    }


    await logChannel.send({
        embeds: [{
            title: `Channel Deleted!`,
            color: BitColors.DarkGreen, 
            fields: [
                {
                    name: `${e.Mods} | Staff:`,
                    value: `${executor}`,
                },
                {
                    name: `💬 | Channel`,
                    value: `${channel.name} | ${channel.id}`,
                },
                {
                    name: `🎯 | Channel Type`,
                    value: `${ChannelsTypes[channel.type]}`,
                }
            ],
        }]
    });
});
