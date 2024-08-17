import mongoose from "mongoose"
import client from "../../core/client.js"
import autorole from "./autorole/autorole_restart.js";

client.invites = new Map();

client.once('ready', async () => {
  import("../../handler/handler.commands.js").then(fn => fn.default(client))

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.DATABASE_TOKEN)
    .then(async () => {
      console.log(`Connected Database | OK!`)
    })
    .catch(async err => {
      console.log('Mongoose Database | FAIL!\n--> ' + err)
    })

  activities()
  autorole()

  for (const guild of client.guilds.cache.values()) {
    try {
      const invites = await guild.invites.fetch();
      client.invites.set(guild.id, new Map(invites.map(inv => [inv.code, inv.uses])));

    } catch (err) {
      console.error(`Erro ao buscar convites para o servidor ${guild.id}:`, err);
    }
  }
  console.log('Event Ready | OK')
})

function activities() {

  /*
  Types:
  0 = Jogando
  2 = Ouvindo
  3 = Assistindo
  */

  const activities = [
    { name: `⌨️ | I'm online on ${client.channels.cache.size} channels!`, type: 0 },
    { name: `💻 | My creator: .andre23k, Thank you my dear for giving me life ❤️`, type: 0 },
    { name: `😊 | I was created to help and entertain you!`, type: 0 },
    { name: `🏆 ┃ Moderating the server!`, type: 0 },
  ]
  const status = [
    'online '
  ];

  let sh = 0;
  setInterval(() => {
    if (sh >= activities.length) sh = 0
    client.user.setActivity(activities[sh])
    sh++;
  }, 7 * 1000);
}
