import { readdirSync } from 'fs'

const eventsFilesNames = readdirSync('src/events/').filter(fileName => fileName.endsWith('.js'))
const eventsFilesFunctions = readdirSync('src/events/functions/').filter(fileName => fileName.endsWith('.js'))

for (const eventFileName of eventsFilesFunctions){
  import(`../events/functions/${eventFileName}`)
}
for (const eventFileName of eventsFilesNames) {
  import(`../events/${eventFileName}`)
}

console.log(`${[...eventsFilesNames, ...eventsFilesFunctions].length} Events | OK`)