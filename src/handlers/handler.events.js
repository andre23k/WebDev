import { EventsLoaded } from '../events/system/systemlogs.js';

import '../events/ready.js'
import '../events/functions/guildMemberAdd.js'
import '../events/error.js'
import '../events/interactionCreate.js'

console.log('Events | OK');
await EventsLoaded()