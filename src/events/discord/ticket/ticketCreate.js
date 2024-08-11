import { ButtonStyle } from 'discord.js';
import { createRequire } from 'node:module';
import Database from '../../../database/Database.js'
import client from '../../../core/client.js';
const require = createRequire(import.meta.url);
const { e } = require("../../../JSON/emojis.json");

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
                    label: 'Open Ticket',
                    emoji: e.Users,
                    custom_id: this.type,
                    style: ButtonStyle.Primary
                },
            ]
        }
        const data = await Database.Guild.findOne({ guildId: interaction.guild.id });
        if (!data || !data.ticket || !data.ticket.categoryId || !data.ticket.channelconfig) {
            return await interaction.reply({
                content: `${e.Desespero} | Hey, I didn't find any data saved in my database on this server!`,
                ephemeral
            })
        }

        await interaction.reply({
            content: `${e.Info} | To start opening and starting a ticket you need to confirm **That you will actually use the function**.\n Do not create tickets without using them or testing their functions (only with permission). Remember we have logs.\n If you want to proceed with the ticket, press the button below.`,
            ephemeral,
            components: [botao]
        });


    }

    async createTicket(interaction, type) {
        if (interaction.customId === 'confirmar_close') return;
        const channel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (channel) {
            await interaction.reply({
                content: `${e.Error} You already have an open ticket in${channel}.`,
                ephemeral
            });
            return;
        }
        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Close',
                    emoji: e.Ok,
                    custom_id: `close-ticket`,
                    style: ButtonStyle.Success
                },
            ]
        }
        const data = await Database.Guild.findOne({ guildId: interaction.guild.id });
        if (!data || !data.ticket || !data.ticket.categoryId || !data.ticket.channelconfig) {
            console.log(`Ticket configuration data not found for guild ${interaction.guild.id}`);
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
                        label: 'Go to channel',
                        url: `https://discord.com/channels/${interaction.guild.id}/${channel.id}`,
                        style: 5
                    }
                ]
            };
            await interaction.reply({
                content: `${e.Info} Hello, your ticket for ${type} was opened on ${channel.toString()}`,
                ephemeral,
                components: [button]
            });
            return await channel.send({
                embeds: [{
                    title: `Creation Center | TICKET \`${type || `Not Found`}\``,
                    color: 0x2f3136,
                    description: `\n\n> ${e.SetaPDW} Welcome to your ticket.\n\n> ${e.SetaPDW} Please wait until a member responsible for tickets comes to see your case.\n\n> ${e.SetaPDW} Thank you for contacting us, remember that tickets are private and only staff members can see them.`,
                    footer: {
                        text: `"Please wait until your TICKET is answered, avoid unnecessary markings." `
                    }
                }], components: [buttons], content: `${interaction.user}`
            }).then(msg => msg.pin());
        });

    }
} 
