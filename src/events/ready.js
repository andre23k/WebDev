import mongoose from "mongoose"
import client from "../client.js"

client.once('ready', async () => {
  import("../handlers/handler.commands.js").then(fn => fn.default(client))

  mongoose.set('strictQuery', true);

  await mongoose.connect(process.env.DATABASE_TOKEN)
    .then(async () => {
      console.log(`Connected Database | OK!`)
    })
    .catch(async err => {
      console.log('Mongoose Database | FAIL!\n--> ' + err)
    })
  activities()
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
    { name: `⌨️ | Estou online em ${client.channels.cache.size} canais!`, type: 0 },
    { name: `FiveM Portugal`, type: 0 },
    { name: `💻 | Meu criador: .andre23k, Obrigado meu querido por me dar a vida ❤️`, type: 0 },
    { name: `😊 | Fui criado para ajudar e divertir vocês!`, type: 0 },
    { name: `🏆 ┃ Moderando o servidor!`, type: 0 },
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
