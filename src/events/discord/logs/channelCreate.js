import { AuditLogEvent } from "discord.js";
import client from "../../../core/client.js";
import { BitColors, ChannelsTypes } from "../../../util/constants.js";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

client.on('channelCreate', async channel => {
    const { guild } = channel;

    const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate }).catch(() => null);
    if (!logs) return;

    const Log = logs.entries.first();
    if (!Log || Log.action !== AuditLogEvent.ChannelCreate) return;

    const { executor } = Log;
    const category = guild.channels.cache.get(channel.id)?.parent?.name || null;

   
    const GuildId = '1291872723026448445'; 
    const destinationChannelId = '1291888300394807317'; 


    const destinationGuild = client.guilds.cache.get(GuildId);
    if (!destinationGuild) {
        console.error(`Não foi possível encontrar o servidor de destino com ID ${GuildId}.`);
        return;
    }


    const logChannel = await destinationGuild.channels.fetch(destinationChannelId).catch(() => null);
    if (!logChannel) {
        console.error(`Não foi possível encontrar o canal de log com ID ${destinationChannelId} no servidor de destino.`);
        return;
    }

    await logChannel.send({
        embeds: [{
            title: `Channel Created!`,
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
                    name: `📁 | Category:`,
                    value: `${category?.toUpperCase() || `Not Found`}`,
                },
                {
                    name: `🎯 | Channel Type`,
                    value: `${ChannelsTypes[channel.type]}`,
                }
            ]
        }]
    });
});
