import { AuditLogEvent } from "discord.js";
import { BitColors } from "../../../util/constants.js";
import client from "../../../core/client.js";

client.on('channelUpdate', async (oldChannel, newChannel) => {
    const { guild } = oldChannel;
    try {
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate });
        const logEntry = logs.entries.first();
        if (!logEntry || logEntry.action !== AuditLogEvent.ChannelUpdate) return;

        const { executor } = logEntry;

        const channelProperties = ['parentId', 'name', 'nsfw', 'rateLimitPerUser', 'type', 'topic', 'defaultAutoArchiveDuration', 'position'];

        if (channelProperties.some(prop => oldChannel[prop] !== newChannel[prop])) {
            await sendChannelUpdateLog(executor, oldChannel, newChannel);
        } else {
            await sendPermissionsUpdateLog(executor, newChannel);
        }
    } catch (error) {
        console.error('Error processing channelUpdate event:', error);
    }
});

async function sendChannelUpdateLog(executor, oldChannel, newChannel) {
    let description = "";

    const trackedProperties = {
        parentId: `\n📂 **Category**: \`${oldChannel.parent?.name || 'None'}\` → \`${newChannel.parent?.name || 'None'}\``,
        name: `\n🏷️ **Name**: \`${oldChannel.name || 'Not Found'}\` → \`${newChannel.name || 'Not Found'}\``,
        nsfw: `\n🔞 **NSFW**: \`${oldChannel.nsfw ? "Enabled" : "Disabled"}\` → \`${newChannel.nsfw ? "Enabled" : "Disabled"}\``,
        rateLimitPerUser: `\n⏰ **Cooldown**: \`${oldChannel.rateLimitPerUser || '0'}s\` → \`${newChannel.rateLimitPerUser || '0'}s\``,
        type: `\n📑 **Type**: \`${oldChannel.type}\` → \`${newChannel.type}\``,
        topic: `\n📃 **Topic**: "${oldChannel.topic || 'None'}" → "${newChannel.topic || 'None'}"`,
        defaultAutoArchiveDuration: `\n🧱 **Auto Archive Duration**: \`${oldChannel.defaultAutoArchiveDuration || 'Not Set'}\` → \`${newChannel.defaultAutoArchiveDuration || 'Not Set'}\``,
        position: `\n🎯 **Position**: \`${oldChannel.position || 'Not Found'}\` → \`${newChannel.position || 'Not Found'}\``,
    };

    for (const [key, value] of Object.entries(trackedProperties)) {
        if (oldChannel[key] !== newChannel[key]) {
            description += value;
        }
    }

    if (!description) return;

  
    const GuildId = '1291872723026448445'; 
    const ChannelId = '1291888300394807317'; 

    const destinationGuild = client.guilds.cache.get(GuildId);
    if (!destinationGuild) {
        console.error(`Não foi possível encontrar o servidor de destino com ID ${GuildId}.`);
        return;
    }


    const logChannel = await destinationGuild.channels.fetch(ChannelId).catch(() => null);
    if (!logChannel) {
        console.error(`Não foi possível encontrar o canal de log com ID ${ChannelId} no servidor de destino.`);
        return;
    }

    return logChannel.send({
        content: `${executor.tag} \`(${executor.id})\` updated the channel **${newChannel.name}**`,
        embeds: [{
            color: BitColors.DarkGreen,
            description,
            timestamp: new Date(),
        }],
    });
}

async function sendPermissionsUpdateLog(executor, newChannel) {
    const permissionsLog = newChannel.permissionOverwrites.cache
        .map(overwrite => {
            const allow = overwrite.allow.toArray().map(perm => `\`${perm}\``).join(', ');
            const deny = overwrite.deny.toArray().map(perm => `\`${perm}\``).join(', ');
            const target = overwrite.type === 'role' ? `<@&${overwrite.id}>` : `<@${overwrite.id}>`;
            return `${target}\n\t├ **Allowed**: ${allow || 'None'}\n\t└ **Denied**: ${deny || 'None'}`;
        })
        .join('\n\n');

    if (!permissionsLog) return;


    const GuildId = '1291872723026448445'; 
    const ChannelId = '1291888300394807317'; 


    const destinationGuild = client.guilds.cache.get(GuildId);
    if (!destinationGuild) {
        console.error(`Não foi possível encontrar o servidor de destino com ID ${GuildId}.`);
        return;
    }

    const logChannel = await destinationGuild.channels.fetch(ChannelId).catch(() => null);
    if (!logChannel) {
        console.error(`Não foi possível encontrar o canal de log com ID ${ChannelId} no servidor de destino.`);
        return;
    }

    return logChannel.send({
        content: `${executor.tag} \`(${executor.id})\` updated permissions for the channel **${newChannel.name}**`,
        embeds: [{
            color: BitColors.DarkGreen,
            fields: [{ name: `🔧 **Permissions Changed**:`, value: permissionsLog }],
            timestamp: new Date(),
        }],
    });
}
