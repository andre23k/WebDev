import { ButtonStyle } from 'discord.js';
import { createRequire } from 'node:module';
import Database from '../../database/Database.js'
import client from '../../client.js';
const require = createRequire(import.meta.url);
const { e } = require("../../JSON/emojis.json");

export default class TicketHandler {
    constructor() {
        this.type = null;
    }

    async SelectMenu(interaction) {
        this.type = interaction.values[0];
        await interaction.message.edit({ components: interaction.message.components }).catch(() => { });

        const botao = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Abrir Ticket',
                    emoji: e.Users,
                    custom_id: this.type,
                    style: ButtonStyle.Primary
                },
            ]
        }
        const data = await Database.Guild.findOne({ guildId: interaction.guild.id });
        if (!data || !data.ticket || !data.ticket.categoryId || !data.ticket.channelconfig) {
            return await interaction.reply({
                content: `${e.Desespero} | Eiei não encontrei nenhum dado salvo no meu banco de dados desse servidor!`,
                ephemeral
            })
        }

        await interaction.reply({
            content: `${e.Info} | Para iniciar a abertura e iniciação de um ticket você precisa confirmar **Que realmente irá usar a função**.\n Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.\n Se quiser prosseguir com o ticket, precione o botão abaixo.`,
            ephemeral,
            components: [botao]
        });


    }

    async createTicket(interaction, type) {
        if (interaction.customId === 'confirmar_close') return;
        const channel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (channel) {
            await interaction.reply({
                content: `${e.Error} Você já possui um ticket aberto em ${channel}.`,
                ephemeral
            });
            return;
        }
        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Encerrar',
                    emoji: e.Ok,
                    custom_id: `close-ticket`,
                    style: ButtonStyle.Success
                },
                {
                    type: 2,
                    label: 'Arquivar',
                    emoji: `📂`,
                    custom_id: `file-ticket`,
                    style: ButtonStyle.Secondary
                }
            ]
        }
        const data = await Database.Guild.findOne({ guildId: interaction.guild.id });
        if (!data || !data.ticket || !data.ticket.categoryId || !data.ticket.channelconfig) {
            console.log(`Dados de configuração do ticket não encontrados para a guilda ${interaction.guild.id}`);
        }
        const category = client.channels.cache.get(data.ticket.categoryId);
        if (!category) return
        await interaction.guild.channels.create({
            name: `${interaction.user.username}-${type || `ticket`}`,
            type: 0,
            parent: category,
            topic: interaction.user.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ["ViewChannel"]
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "SendMessages", "AddReactions", "AttachFiles"]
                },
            ]
        }).then(async channel => {
            const button = {
                type: 1,
                components: [
                    {
                        type: 2,
                        label: 'Ir para o canal',
                        url: `https://discord.com/channels/${interaction.guild.id}/${channel.id}`,
                        style: 5
                    }
                ]
            };
            await interaction.reply({
                content: `${e.Info} Olá, seu ticket de ${type} foi aberto em ${channel.toString()}`,
                ephemeral,
                components: [button]
            });
            return await channel.send({
                embeds: [{
                    title: `Central da Criação | TICKET DE \`${type || `Not Found`}\``,
                    color: 0x2f3136,
                    description: `\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW} Espere até que algum membro responsável pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW} Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`,
                    footer: { text: `"Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." ` }
                }], components: [buttons], content: `${interaction.user}`
            }).then(msg => msg.pin());
        });

    }
} 
