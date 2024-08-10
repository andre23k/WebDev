import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { BitColors } from "../../util/constants.js";
import Database from "../../database/Database.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "rankinvites",
    description: "〔⚙️ Utilidade〕 See the invite ranking!",
    dm_permission: false,

    run: async (client, interaction, args) => {
        try {
            await interaction.reply({
                content: `${e.Load} | Okay, just a second..`,
            });

            const guildId = interaction.guild.id;
            const guildData = await Database.Guild.findOne({ Id: guildId });

            if (!guildData || !guildData.invites || guildData.invites.length === 0) {
                return interaction.editReply({
                    content: `${e.Saphire_triste} | No invitations registered yet.`,
                });
            }

            const inviteRanking = guildData.invites
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            const userId = interaction.user.id;
            const userIndex = inviteRanking.findIndex((user) => user.userid === userId);
            const userRanking = userIndex !== -1 ? userIndex + 1 : '^2000';

            await interaction.editReply({
                content: null,
                embeds: [{
                    title: `Ranking - Global Invites`,
                    color: BitColors.Blue,
                    footer: { text: `Your ranking: ${userRanking}` },
                    description: inviteRanking
                        .map((data, index) => {
                            return `${e.Coroa} ${index + 1}.  ${client.users.cache.get(data.userid)?.tag || 'User#0000'} \`${data.userid}\` \n ${data.count} invites\n`;
                        })
                        .join("\n"),
                }],
            });
        } catch (err) {
            console.error('Erro ao executar comando rankinvites:', err);
            await interaction.editReply({
                content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`,
                ephemeral: true,
            });
        }
    },
};
