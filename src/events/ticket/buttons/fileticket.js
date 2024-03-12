import { PermissionFlagsBits } from 'discord.js';
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../../../JSON/emojis.json")

export default async function fileticket(interaction){
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({ content: `${e.Error} Você não tem permissão para realizar essa ação.`, ephemeral: true })
    } else {
        const newCategoryId = '1195795946076913775';
        const topicmember = interaction.channel.topic;
        if (topicmember) {
            await interaction.channel.permissionOverwrites.edit(topicmember, {
                ViewChannel: false,
            })
        }
        if (interaction.channel.parentId === newCategoryId) {
            await interaction.reply({ content: `${e.Info} | Este ticket já foi arquivado.`, ephemeral: true });
            return;
        }

        await interaction.reply({ content: `${e.Ok} | Ticket arquivado com sucesso.`, ephemeral: false })

        await interaction.channel.setParent(newCategoryId);
        await interaction.channel.setTopic('').catch(() => null)
        interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false },).catch(err => {
            interaction.editReply({ content: `${e.Error} | Houve um erro ao arquivar o ticket.\n${err}` })
        })
    }
}