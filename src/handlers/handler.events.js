import { readdirSync } from 'fs'

const eventsFilesNames = readdirSync('src/events/').filter(fileName => fileName.endsWith('.js'))
const eventsFilesFunctions = readdirSync('src/events/functions/').filter(fileName => fileName.endsWith('.js'))
const eventsFilesclasses = readdirSync('src/events/classes/').filter(fileName => fileName.endsWith('.js'))

for (const eventFileName of eventsFilesFunctions){
  import(`../events/functions/${eventFileName}`)
}
for (const eventFileName of eventsFilesNames) {
  import(`../events/${eventFileName}`)
}
for (const eventFileName of eventsFilesclasses) {
  import(`../events/classes/${eventFileName}`)
}

console.log(`${[...eventsFilesNames, ...eventsFilesFunctions, ...eventsFilesclasses ].length} Events | OK`)