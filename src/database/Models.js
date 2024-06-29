import Modelinvite from './models/invite.js';
import ModelTicket from './models/ticketconfig.js'
class Models {
    constructor() {
        this.Invite = Modelinvite
        this.Ticket = ModelTicket
    }
}

export {
    Models
}

