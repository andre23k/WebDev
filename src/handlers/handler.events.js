import { EventsLoaded } from '../events/logs/systemlogs.js';
import { readdirSync } from 'fs'

const eventsFilesNames = readdirSync('./src/events/').filter(fileName => fileName.endsWith('.js'))
for (const eventFileName of eventsFilesNames)
    import(`../events/${eventFileName}`)
await EventsLoaded()
console.log(`${[...eventsFilesNames].length} Events | OK`)