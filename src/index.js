import "dotenv/config.js"
import client from "./client.js";
import './events/index.js'
import './handlers/handler.events.js'

client.login()