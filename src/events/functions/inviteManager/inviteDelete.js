import { AuditLogEvent } from 'discord.js';
import client from '../../../client.js';
import Database from '../../../database/Database.js';

client.on('guildAuditLogEntryCreate', async (guildAuditLogsEntry, guild) => {
    if (guildAuditLogsEntry.action !== AuditLogEvent.InviteDelete) return;

    const guildId = guild.id;
    const target = guildAuditLogsEntry.target;

    if (!target || !target.inviterId || !target.code) return;

    const invites = await guild.invites.fetch();
    client.invites.set(guild.id, new Map(invites.map(inv => [inv.code, inv.uses])));

    const userId = target.inviterId;
    const code = target.code;

    try {

        const guildData = await Database.Guild.findOne({ Id: guildId, "invites.userid": userId });
        if (!guildData) return;

        const invite = guildData.invites.find(inv => inv.userid === userId);

        if (!invite || !invite.code.includes(code)) return;

        await Database.Guild.findOneAndUpdate(
            { Id: guildId, "invites.userid": userId },
            { $pull: { "invites.$.code": code } },
            { new: true }
        );

    } catch (error) {
        console.error('Erro ao atualizar o documento Guild:', error);
    }
});
