import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('RegisterConfig', new Schema({
    guildId: { type: String, unique: true },
    welcomechannelId: { type: String },
    invitechannelId: { type: String },
    activeEvent: { type: Boolean }
}
))
