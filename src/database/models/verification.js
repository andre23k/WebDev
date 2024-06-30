import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('Verification', new Schema({
    guildId: { type: String, unique: true },
    channelconfig: { type: String },
    channellog: { type: String },
    roleverifcationId: { type: String },
}
))
