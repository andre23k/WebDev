import { EventsLoaded } from '../events/system/systemlogs.js';

import '../events/ready.js'
import '../events/functions/guildMemberAdd.js'
import '../events/error.js'
import '../events/interactionCreate.js'

await EventsLoaded()
console.log('Events | OK');