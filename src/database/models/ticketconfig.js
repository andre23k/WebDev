import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('TicketConfig', new Schema({
    guildId: { type: String, unique: true },
    channelconfig: { type: String },
    channellog: { type: String },
    categoryId: { type: String },
    rolemodId: { type: [String] },
    userId: { type: String }
}
))
