import client from '../../../client.js'
import Database from '../../../database/Database.js'

client.on("inviteCreate", async invite => {
    const { guild, inviter, code } = invite;
    if (!inviter) return;

    const invites = await invite.guild.invites.fetch();
    client.invites.set(invite.guild.id, new Map(invites.map(inv => [inv.code, inv.uses])));

    try {
        const guildData = await Database.Guild.findOne({ Id: guild.id });

        if (!guildData) {
            await Database.Guild.create({
                Id: guild.id,
                invites: [{ userid: inviter.id, code: [code] }]
            });
        } else {
            const datainvite = guildData.invites.find(inv => inv.userid === inviter.id);

            if (datainvite) {
                await Database.Guild.findOneAndUpdate(
                    { Id: guild.id, "invites.userid": inviter.id },
                    {
                        $push: { "invites.$.code": code }
                    },
                    {
                        new: true,
                    }
                );
            } else {
                await Database.Guild.findOneAndUpdate(
                    { Id: guild.id },
                    {
                        $push: { invites: { userid: inviter.id, code: [code] } }
                    },
                    {
                        new: true,
                        upsert: true
                    }
                );
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar o documento Guild:", error);
    }
});