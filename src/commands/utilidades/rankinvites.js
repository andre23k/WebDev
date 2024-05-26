import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";
import { BitColors } from "../../util/constants.js";
import Database from "../../database/Database.js";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default {
    name: "rankinvites",
    description: "〔⚙️ Utilidade〕 Veja o rank de invites!",
    dm_permission: false,

    run: async (client, interaction, args) => {
        try {
            await interaction.reply({
                content: `${e.Load} | Ok, só um segundo..`,
            });

            const userId = interaction.user.id;
            const inviteRanking = await Database.Invite.find({})
                .sort({ count: -1 })
                .limit(10);

            const userIndex = inviteRanking.findIndex((user) => user.userid === userId);
            const userRanking = userIndex !== -1 ? userIndex + 1 : '^2000';

            if (inviteRanking.length === 0) {
                return interaction.editReply({
                    content: `${e.Saphire_triste} | Nenhum convite registrado ainda.`,
                });
            }

            await interaction.editReply({
                content: null,
                embeds: [{
                    title: `Ranking - Global Invites`,
                    color: BitColors.Blue,
                    footer: { text: `Seu ranking: ${userRanking}` },
                    description: inviteRanking
                        .map((data, index) => {
                            return `${e.Coroa} ${index + 1}.  ${client.users.cache.get(data.userid)?.tag || 'User#0000'} \`${data.userid}\` \n ${data.count} invites\n`;
                        })
                        .join("\n"),
                }],
            });
        } catch (err) {
            console.log(err);
            await interaction.editReply({
                content: `${e.Saphire_triste} | Ocorreu um erro ao executar esse comando!`,
                ephemeral,
            });
        }
    },
};
