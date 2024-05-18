import "./prototypes/index.js"
import "djs-protofy/init";
process.env.TZ = "America/Sao_Paulo"
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { discloud } from 'discloud.app'
import LoadEvents from './handlers/handler.events.js'
await discloud.login()
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
    async login() {
        await LoadEvents()
        super.login()
    }  
}

const client = new Lesath()
export default client
