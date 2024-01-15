import client from '../client.js';
import moment from 'moment';
import discordTranscripts from 'discord-html-transcripts';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { e } = require("../JSON/emojis.json")

export default async function ticketcreate(interaction) {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'menu') {
            interaction.message.edit({ components: interaction.message.components }).catch(() => { })
            switch (interaction.values[0]) {

                case 'support':

                    let botao = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("abrir")
                                .setEmoji(`${e.Users}`)
                                .setLabel("Abrir Ticket")
                                .setStyle("Primary"),
                        );

                    interaction.reply({
                        content: `${e.Info} | Para iniciar a abertura e iniciação de um ticket você precisa confirmar **Que realmente irá usar a função**.\n Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.\n Se quiser prosseguir com o ticket, precione o botão abaixo.`, components: [botao], ephemeral: true
                    })

                    break;

                case 'abrir':
                    const channel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                    if (channel)
                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channel}.`, ephemeral: true })

                    const rowclosesupport = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close-ticket`)
                                .setLabel(`Fechar`)
                                .setStyle(`Danger`)
                                .setEmoji(`${e.Abangoglob}`),

                            new ButtonBuilder()
                                .setCustomId(`encerrar-ticket`)
                                .setLabel(`Encerrar`)
                                .setStyle(`Success`)
                                .setEmoji(`${e.Ok}`),

                            new ButtonBuilder()
                                .setCustomId(`arquivar-ticket`)
                                .setLabel(`Arquivar`)
                                .setStyle(`Secondary`)
                                .setEmoji(`📂`),


                        )
                    const embedsupport = new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle("Central da Criação | TICKET DE `SUPPORT` ")
                        .setFooter({ text: 'Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias.' })
                        .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                    interaction.guild.channels.create({
                        name: `${interaction.user.username}-support`,
                        parent: "1165705261026132011",
                        type: 0,
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

                    }).then(channel => {
                        const button = {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Ir para o canal',
                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                    style: 5
                                }
                            ]
                        }

                        interaction.reply({ content: `  Olá, seu ticket de suporte foi aberto em ${channel.toString()}`, ephemeral: true, components: [button] })
                        channel.send({ embeds: [embedsupport], components: [rowclosesupport], content: `${interaction.user},  ` })
                    })
                    break;

                case 'sugestão':

                    let botaosug = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("abrir1")
                                .setEmoji(`${e.Users}`)
                                .setLabel("Abrir Ticket")
                                .setStyle("Primary"),
                        );

                    return interaction.reply({
                        content: `${e.Info} | Para iniciar a abertura e iniciação de um ticket você precisa confirmar **Que realmente irá usar a função**.\n Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.\n Se quiser prosseguir com o ticket, precione o botão abaixo.`, components: [botaosug], ephemeral: true
                    })


                case 'abrir1':
                    const channell = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                    if (channell)
                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channell}.`, ephemeral: true })


                    const rowclosesuges = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close-ticket`)
                                .setLabel(`Fechar`)
                                .setStyle(`Danger`)
                                .setEmoji(`${e.Abangoglob}`),
                            new ButtonBuilder()
                                .setCustomId(`encerrar-ticket`)
                                .setLabel(`Encerrar`)
                                .setStyle(`Success`)
                                .setEmoji(`${e.Ok}`),

                            new ButtonBuilder()
                                .setCustomId(`arquivar-ticket`)
                                .setLabel(`Arquivar`)
                                .setStyle(`Secondary`)
                                .setEmoji(`📂`),


                        )
                    const embedsuges = new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle("Central da Criação | TICKET DE `SUGESTÃO` ")
                        .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                        .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                    interaction.guild.channels.create({
                        name: `${interaction.user.username}-sugestão`,
                        parent: "1165705261026132011",
                        type: 0,
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

                    }).then(channel => {
                        const button = {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Ir para o canal',
                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                    style: 5
                                }
                            ]
                        }

                        interaction.reply({ content: ` ${e.Info} Olá, seu ticket de sugestão foi aberto em  ${channel.toString()}`, ephemeral: true, components: [button] })
                        channel.send({ embeds: [embedsuges], components: [rowclosesuges], content: `${interaction.user}` }).then(msg => msg.pin())
                    })
                    break;

                case 'denúncia':
                    let botaodenu = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("abrir2")
                                .setEmoji(`${e.Users}`)
                                .setLabel("Abrir Ticket")
                                .setStyle("Primary"),
                        );

                    return interaction.reply({
                        content: `${e.Info} | Para iniciar a abertura e iniciação de um ticket você precisa confirmar **Que realmente irá usar a função**.\n Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.\n Se quiser prosseguir com o ticket, precione o botão abaixo.`, components: [botaodenu], ephemeral: true
                    })
                case 'abrir2':
                    const channe = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                    if (channe)
                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channe}.`, ephemeral: true })

                    const rowclosedenuncia = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close-ticket`)
                                .setLabel(`Fechar`)
                                .setStyle(`Danger`)
                                .setEmoji(`${e.Abangoglob}`),
                            new ButtonBuilder()
                                .setCustomId(`encerrar-ticket`)
                                .setLabel(`Encerrar`)
                                .setStyle(`Success`)
                                .setEmoji(`${e.Ok}`),

                            new ButtonBuilder()
                                .setCustomId(`arquivar-ticket`)
                                .setLabel(`Arquivar`)
                                .setStyle(`Secondary`)
                                .setEmoji(`📂`),



                        )
                    const embeddenuncia = new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle(`Central da Criação ┃ Ticket de \`Denúncia\``)
                        .setDescription(`Olá ${interaction.user}, utilize o formato de denuncia estabelecido aqui no servidor:\n${e.SetaPDW} \`ID do Usuário:\`\n${e.SetaPDW} \`Motivo\`\n${e.SetaPDW} \`Provas:\`\n\nEm alguns instantes nossa equipe entrará em contato com você por meio desse ticket, desse modo, aguarde e não encerre seu processo até que tudo seja resolvido.`)
                        .setFooter({ text: `Aguarde até que seu TICKET seja respondido, evite marcações desnecessária.` })
                    interaction.guild.channels.create({
                        name: `${interaction.user.username}-denúncia`,
                        parent: "1165705261026132011",
                        type: 0,
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

                    }).then(channel => {
                        const button = {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Ir para o canal',
                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                    style: 5
                                }
                            ]
                        }

                        interaction.reply({ content: ` ${e.Info} Olá, seu ticket de denúncia foi aberto em ${channel.toString()}`, ephemeral: true, components: [button] })
                        channel.send({ embeds: [embeddenuncia], components: [rowclosedenuncia], content: `${interaction.user}` }).then(msg => msg.pin())
                    })
                    break;

                case 'punição':
                    let botaopuni = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("abrir3")
                                .setEmoji(`${e.Users}`)
                                .setLabel("Abrir Ticket")
                                .setStyle("Primary"),
                        );

                    return interaction.reply({
                        content: `${e.Info} | Para iniciar a abertura e iniciação de um ticket você precisa confirmar **Que realmente irá usar a função**.\n Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.\n Se quiser prosseguir com o ticket, precione o botão abaixo.`, components: [botaopuni], ephemeral: true
                    })
                case 'abrir3':
                    const ticketpunicao = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                    if (ticketpunicao)
                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${ticketpunicao}.`, ephemeral: true })


                    const rowclosepunicao = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close-ticket`)
                                .setLabel(`Fechar`)
                                .setStyle(`Danger`)
                                .setEmoji(`${e.Abangoglob}`),

                            new ButtonBuilder()
                                .setCustomId(`encerrar-ticket`)
                                .setLabel(`Encerrar`)
                                .setStyle(`Success`)
                                .setEmoji(`${e.Ok}`),

                            new ButtonBuilder()
                                .setCustomId(`arquivar-ticket`)
                                .setLabel(`Arquivar`)
                                .setStyle(`Secondary`)
                                .setEmoji(`📂`),


                        )
                    const embedpunicao = new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle("Central da Criação | TICKET DE `PUNIÇÃO` ")
                        .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                        .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                    interaction.guild.channels.create({
                        name: `${interaction.user.username}-punição`,
                        parent: "1165705261026132011",
                        type: 0,
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

                    }).then(channel => {
                        const button = {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Ir para o canal',
                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                    style: 5
                                }
                            ]
                        }

                        interaction.reply({ content: ` ${e.Info} Olá, seu ticket de punição foi aberto em  ${channel.toString()}`, ephemeral: true, components: [button] })
                        channel.send({ embeds: [embedpunicao], components: [rowclosepunicao], content: `${interaction.user}` }).then(msg => msg.pin())
                    })
                    break;


                case 'opção':
                    let botaop = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("abrir4")
                                .setEmoji(`${e.Users}`)
                                .setLabel("Abrir Ticket")
                                .setStyle("Primary"),
                        );

                    return interaction.reply({
                        content: `${e.Info} | Se seu problema ou dúvida não pode ser resolvido nos chats de suporte comunitario, fale com um atendente sobre sua questão criando um ticket abaixo. \n **Não crie tickets sem utiliza-los ou testar as suas funções (apenas com permissão). Lembre-se temos logs.** `
                        , components: [botaop], ephemeral: true
                    })
                case 'abrir4':
                    const ticketajuda = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                    if (ticketajuda)
                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${ticketajuda}.`, ephemeral: true })


                    const rowcloseop = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close-ticket`)
                                .setLabel(`Fechar`)
                                .setStyle(`Danger`)
                                .setEmoji(`${e.Abangoglob}`),

                            new ButtonBuilder()
                                .setCustomId(`encerrar-ticket`)
                                .setLabel(`Encerrar`)
                                .setStyle(`Success`)
                                .setEmoji(`${e.Ok}`),

                            new ButtonBuilder()
                                .setCustomId(`arquivar-ticket`)
                                .setLabel(`Arquivar`)
                                .setStyle(`Secondary`)
                                .setEmoji(`📂`),


                        )
                    const embedop = new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle("Central da Criação | TICKET DE `AJUDA` ")
                        .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                        .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                    interaction.guild.channels.create({
                        name: `${interaction.user.username}-ajuda`,
                        parent: "1165705261026132011",
                        type: 0,
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

                    }).then(channel => {
                        const button = {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: 'Ir para o canal',
                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                    style: 5
                                }
                            ]
                        }

                        interaction.reply({ content: `${e.Info} Olá, seu ticket de ajuda foi aberto em ${channel.toString()}`, ephemeral: true, components: [button] })
                        channel.send({ embeds: [embedop], components: [rowcloseop], content: `${interaction.user}` }).then(msg => msg.pin())
                    })
                    break;

            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'encerrar-ticket') {
            if (!interaction.member.permissions.has("ManageWebhooks")) return interaction.reply({ content: `${e.Error} Você não tem permissão para realizar essa ação.`, ephemeral: true })

            interaction.reply({ content: `${e.Load} | O ticket será encerrado em 10 segundos.`, ephemeral: false, fetchReply: true }).then(() => {
                setTimeout(async () => {
                    const message = interaction.message.content;
                    const channel = interaction.channel;
                    const attachment = await discordTranscripts.createTranscript(channel, {
                        limit: 1000, // Max amount of messages to fetch. `-1` recursively fetches.
                        returnType: 'attachment', // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
                        filename: `logs_${channel.name}.html`, // Only valid with returnType is 'attachment'. Name of attachment.
                        saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)

                        poweredBy: true // Whether to include the "Powered by discord-html-transcripts" footer
                    });

                    const logchannel = client.channels.cache.get('1165706306573832212');

                    let embedclose = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: `🎫 | Quem Fechou`,
                                value: `${interaction.user || `Not Found`}, \`${interaction.user.id || `Not Found`}\``,
                                inline: false
                            },
                            {
                                name: `🎫 | Nome do ticket:`,
                                value: `\`${interaction.channel.name || `Not Found`}\``,
                                inline: false
                            },
                            {
                                name: `📅 | Data:`,
                                value: `<t:${moment(interaction.createdTimestamp).unix()}>(<t:${~~(new Date(interaction.createdTimestamp) / 1000)}:R>)`,
                                inline: false
                            }
                        )

                    return logchannel.send({
                        embeds: [embedclose],
                        files: [attachment]

                    }),
                        interaction.channel.delete()

                }, 10 * 1000);

            })
        }
        else if (interaction.isButton()) {
            if (interaction.customId === 'close-ticket') {
                await interaction.reply({ content: `${e.Load} | O ticket será fechado em 10 segundos...`, ephemeral: false, fetchReply: true }).then(() => {
                    setTimeout(async () => {
                        await interaction.editReply({ content: `${e.Ok} | Ticket fechado com sucesso.`, ephemeral: false, fetchReply: true })
                        interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false },).catch(err => {
                            interaction.editReply({ content: `${e.Error} | Houve um erro ao fechar seu ticket.\n${err}` })
                        })
                    }, 10 * 1000);

                })
            }

            else if (interaction.isButton()) {
                if (interaction.customId === 'arquivar-ticket') {
                    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
                        return interaction.reply({ content: `${e.Error} Você não tem permissão para realizar essa ação.`, ephemeral: true })

                    await interaction.reply({
                        content: `${e.Load} | O ticket será arquivado em 10 segundos...`,
                        ephemeral: false,
                        fetchReply: true
                    }).then(() => {
                        setTimeout(async () => {
                            const newCategoryId = '1195795946076913775';
                            const topicmember = interaction.channel.topic;

                            if (topicmember) {
                                await interaction.channel.permissionOverwrites.edit(topicmember, {
                                    ViewChannel: false,
                                })
                            }
                            if (!topicmember) return

                            await interaction.editReply({ content: `${e.Ok} | Ticket arquivado com sucesso.`, ephemeral: false, fetchReply: true })

                            await interaction.channel.setParent(newCategoryId);
                            await interaction.channel.setTopic('').catch(() => null)
                            interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false },).catch(err => {
                                interaction.editReply({ content: `${e.Error} | Houve um erro ao arquivar o ticket.\n${err}` })
                            })
                        }, 10 * 1000);

                    })
                }
                //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                // SISTEMA DE TICKET (QUANDO CLICAR EM ABRIR)

                else if (interaction.isButton()) {
                    if (interaction.customId === 'abrir') {
                        const channel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                        if (channel)
                            return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channel}.`, ephemeral: true })



                        const rowclosesupport = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`close-ticket`)
                                    .setLabel(`Fechar`)
                                    .setStyle(`Danger`)
                                    .setEmoji(`${e.Abangoglob}`),

                                new ButtonBuilder()
                                    .setCustomId(`encerrar-ticket`)
                                    .setLabel(`Encerrar`)
                                    .setStyle(`Success`)
                                    .setEmoji(`${e.Ok}`),

                                new ButtonBuilder()
                                    .setCustomId(`arquivar-ticket`)
                                    .setLabel(`Arquivar`)
                                    .setStyle(`Secondary`)
                                    .setEmoji(`📂`),

                            )
                        const embedsupport = new EmbedBuilder()
                            .setColor("#2f3136")
                            .setTitle("Central da Criação | TICKET DE `SUPPORT` ")
                            .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                            .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                        interaction.guild.channels.create({
                            name: `${interaction.user.username}-support`,
                            parent: "1165705261026132011",
                            type: 0,
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

                        }).then(channel => {
                            const button = {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        label: 'Ir para o canal',
                                        url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                        style: 5
                                    }
                                ]
                            }

                            interaction.reply({ content: `  Olá, seu ticket de suporte foi aberto em ${channel.toString()}`, ephemeral: true, components: [button] })
                            channel.send({ embeds: [embedsupport], components: [rowclosesupport], content: `${interaction.user}` }).then(msg => msg.pin())
                        })
                    }
                    else if (interaction.isButton()) {
                        if (interaction.customId === 'abrir1') {
                            const channell = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                            if (channell)
                                return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channell}.`, ephemeral: true })

                            const rowclosesuges = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`close-ticket`)
                                        .setLabel(`Fechar`)
                                        .setStyle(`Danger`)
                                        .setEmoji(`${e.Abangoglob}`),

                                    new ButtonBuilder()
                                        .setCustomId(`encerrar-ticket`)
                                        .setLabel(`Encerrar`)
                                        .setStyle(`Success`)
                                        .setEmoji(`${e.Ok}`),

                                    new ButtonBuilder()
                                        .setCustomId(`arquivar-ticket`)
                                        .setLabel(`Arquivar`)
                                        .setStyle(`Secondary`)
                                        .setEmoji(`📂`),



                                )
                            const embedsuges = new EmbedBuilder()
                                .setColor("#2f3136")
                                .setTitle("Central da Criação | TICKET DE `SUGESTÃO` ")
                                .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                                .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                            interaction.guild.channels.create({
                                name: `${interaction.user.username}-sugestão`,
                                parent: "1165705261026132011",
                                type: 0,
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

                            }).then(channel => {
                                const button = {
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            label: 'Ir para o canal',
                                            url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                            style: 5
                                        }
                                    ]
                                }

                                interaction.reply({ content: ` ${e.Info} Olá, seu ticket de sugestão foi aberto em  ${channel.toString()}`, ephemeral: true, components: [button] })
                                channel.send({ embeds: [embedsuges], components: [rowclosesuges], content: `${interaction.user}` }).then(msg => msg.pin())
                            })
                        }
                        else if (interaction.isButton()) {
                            if (interaction.customId === 'abrir2') {
                                const channe = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                                if (channe)
                                    return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${channe}.`, ephemeral: true })

                                const rowclosedenuncia = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`close-ticket`)
                                            .setLabel(`Fechar`)
                                            .setStyle(`Danger`)
                                            .setEmoji(`${e.Abangoglob}`),

                                        new ButtonBuilder()
                                            .setCustomId(`encerrar-ticket`)
                                            .setLabel(`Encerrar`)
                                            .setStyle(`Success`)
                                            .setEmoji(`${e.Ok}`),

                                        new ButtonBuilder()
                                            .setCustomId(`arquivar-ticket`)
                                            .setLabel(`Arquivar`)
                                            .setStyle(`Secondary`)
                                            .setEmoji(`📂`),


                                    )
                                const embeddenuncia = new EmbedBuilder()
                                    .setColor("#2f3136")
                                    .setTitle(`Central da Criação ┃ Ticket de \`Denúncia\``)
                                    .setDescription(`Olá ${interaction.user}, utilize o formato de denuncia estabelecido aqui no servidor:
                                
                                ${e.SetaPDW} \`ID do Usuário:\`
                                
                                ${e.SetaPDW} \`Motivo\`
                                
                                ${e.SetaPDW} \`Provas:\`
                                
                                 Em alguns instantes nossa equipe entrará em contato com você por meio desse ticket, desse modo, aguarde e não encerre seu processo até que tudo seja resolvido.
                                
                                **Aguarde até que seu TICKET seja respondido, evite marcações desnecessária.**`);
                                interaction.guild.channels.create({
                                    name: `${interaction.user.username}-denúncia`,
                                    parent: "1165705261026132011",
                                    type: 0,
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

                                }).then(channel => {
                                    const button = {
                                        type: 1,
                                        components: [
                                            {
                                                type: 2,
                                                label: 'Ir para o canal',
                                                url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                                style: 5
                                            }
                                        ]
                                    }

                                    interaction.reply({ content: ` ${e.Info} Olá, seu ticket de denúncia foi aberto em  ${channel.toString()}`, ephemeral: true, components: [button] })
                                    channel.send({ embeds: [embeddenuncia], components: [rowclosedenuncia], content: `${interaction.user}` }).then(msg => msg.pin())
                                })
                            }
                            else if (interaction.isButton()) {
                                if (interaction.customId === 'abrir3') {
                                    const ticketpunicao = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                                    if (ticketpunicao)
                                        return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${ticketpunicao}.`, ephemeral: true })


                                    const rowclosepunicao = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId(`close-ticket`)
                                                .setLabel(`Fechar`)
                                                .setStyle(`Danger`)
                                                .setEmoji(`${e.Abangoglob}`),
                                            new ButtonBuilder()
                                                .setCustomId(`encerrar-ticket`)
                                                .setLabel(`Encerrar`)
                                                .setStyle(`Success`)
                                                .setEmoji(`${e.Ok}`),

                                            new ButtonBuilder()
                                                .setCustomId(`arquivar-ticket`)
                                                .setLabel(`Arquivar`)
                                                .setStyle(`Secondary`)
                                                .setEmoji(`📂`),


                                        )
                                    const embedpunicao = new EmbedBuilder()
                                        .setColor("#2f3136")
                                        .setTitle("Central da Criação | TICKET DE `PUNIÇÃO` ")
                                        .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                                        .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                                    interaction.guild.channels.create({
                                        name: `${interaction.user.username}-punição`,
                                        parent: "1165705261026132011",
                                        type: 0,
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

                                    }).then(channel => {
                                        const button = {
                                            type: 1,
                                            components: [
                                                {
                                                    type: 2,
                                                    label: 'Ir para o canal',
                                                    url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                                    style: 5
                                                }
                                            ]
                                        }

                                        interaction.reply({ content: ` ${e.Info} Olá, seu ticket de punição foi aberto em  ${channel.toString()}`, ephemeral: true, components: [button] })
                                        channel.send({ embeds: [embedpunicao], components: [rowclosepunicao], content: `${interaction.user}` }).then(msg => msg.pin())
                                    })

                                }
                                else if (interaction.isButton()) {
                                    if (interaction.customId === 'abrir4') {
                                        const ticketajuda = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id)
                                        if (ticketajuda)
                                            return await interaction.reply({ content: `${e.Error} Você já possui um ticket aberto em ${ticketajuda}.`, ephemeral: true })


                                        const rowcloseop = new ActionRowBuilder()
                                            .addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId(`close-ticket`)
                                                    .setLabel(`Fechar`)
                                                    .setStyle(`Danger`)
                                                    .setEmoji(`${e.Abangoglob}`),

                                                new ButtonBuilder()
                                                    .setCustomId(`encerrar-ticket`)
                                                    .setLabel(`Encerrar`)
                                                    .setStyle(`Success`)
                                                    .setEmoji(`${e.Ok}`),

                                                new ButtonBuilder()
                                                    .setCustomId(`arquivar-ticket`)
                                                    .setLabel(`Arquivar`)
                                                    .setStyle(`Secondary`)
                                                    .setEmoji(`📂`),


                                            )
                                        const embedop = new EmbedBuilder()
                                            .setColor("#2f3136")
                                            .setTitle("Central da Criação | TICKET DE `AJUDA` ")
                                            .setFooter({ text: "Aguarde até que seu TICKET seja respondido, evite marcações desnecessárias." })
                                            .setDescription(`\n\n> ${e.SetaPDW} Seja Bem-Vindo ao seu ticket.\n\n> ${e.SetaPDW}  Espere até que algum membro responsavel pelos tickets venha ver o seu caso.\n\n> ${e.SetaPDW}  Agradecemos pelo seu contato, lembre-se os tickets são privados e só membros da staff conseguem ver.`);

                                        interaction.guild.channels.create({
                                            name: `${interaction.user.username}-ajuda`,
                                            parent: "1165705261026132011",
                                            type: 0,
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

                                        }).then(channel => {
                                            const button = {
                                                type: 1,
                                                components: [
                                                    {
                                                        type: 2,
                                                        label: 'Ir para o canal',
                                                        url: `https://discord.com/channels/993634908377464912/${channel.id}`,
                                                        style: 5
                                                    }
                                                ]
                                            }

                                            interaction.reply({ content: `${e.Info} Olá, seu ticket de ajuda foi aberto em ${channel.toString()}`, ephemeral: true, components: [button] })
                                            channel.send({ embeds: [embedop], components: [rowcloseop], content: `${interaction.user}` }).then(msg => msg.pin())
                                        })

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

