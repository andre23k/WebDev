import Modelinvite from './models/invite.js';
import ModelTicket from './models/ticketconfig.js'
import ModelVerification from './models/verification.js'
import ModelRegister from './models/registerconfig.js'
class Models {
    constructor() {
        this.Invite = Modelinvite
        this.Ticket = ModelTicket
        this.Verification = ModelVerification
        this.Register = ModelRegister
    }
}

export {
    Models
}

