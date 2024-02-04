import client from "../../client.js";

client.on('messageCreate', async message => {
    client.message++
})