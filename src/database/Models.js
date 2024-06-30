import Modelinvite from './models/invite.js';
import ModelTicket from './models/ticketconfig.js'
import ModelVerification from './models/verification.js'
class Models {
    constructor() {
        this.Invite = Modelinvite
        this.Ticket = ModelTicket
        this.Verification = ModelVerification
    }
}

export {
    Models
}

