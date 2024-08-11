import "../prototypes/index.js"
import "djs-protofy/init";
process.env.TZ = "America/Sao_Paulo"
import { Client, Collection, GatewayIntentBits, Partials, } from 'discord.js'
import { join, dirname, extname } from 'path'
import loaddir from '../util/loaddir.js'
import { fileURLToPath } from 'url';
import { discloud } from 'discloud.app'
await discloud.login()

class Lesath extends Client {
    /**@type {Collection <string, any>} */
    slashCommands = new Collection()
    interactions = 0
    constructor() {
        super({
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
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User
            ],
        })
    }
    async login() {
        const events = [];
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        await loaddir(join(__dirname, "..", "events"), (err, output, file) => {
            if (err) console.error(err);
            if (output) events.push(file.name.replace(extname(file.name), ""));
        });
        console.log(events.length, "Events | OK");
        super.login()
    }
}

const client = new Lesath()
export default client
