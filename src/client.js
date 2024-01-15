import "./prototypes/index.js"
process.env.TZ = "America/Sao_Paulo"
import { Client, Collection, GatewayIntentBits } from 'discord.js'

const options = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
};
class Lesath extends Client {
    /**@type {Collection <string, any>} */
    slashCommands = new Collection()
    interactions = 0
    constructor() {
        super(options)
    }
}

const client = new Lesath()
export default client

