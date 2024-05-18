import { EventsLoaded } from '../events/logs/systemlogs.js';
import { readdirSync } from 'fs'

export default async function LoadEvents(){
    const eventsFilesNames = readdirSync('./src/events/').filter(fileName => fileName.endsWith('.js'));
    const eventsFilesFunctions= readdirSync('./src/events/functions').filter(fileName => fileName.endsWith('.js'));

    for (const eventFileName of eventsFilesNames) {
        await import(`../events/${eventFileName}`);
    }
    for (const eventFilefunction of eventsFilesFunctions)
        import(`../events/functions/${eventFilefunction}`)

    console.log(`${[...eventsFilesNames, ...eventsFilesFunctions].length} Events | OK`)
    await EventsLoaded();
}