import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('Guild', new Schema({
    Id: { type: String, unique: true },
    register: {
        welcomechannelId: { type: String },
        invitechannelId: { type: String },
        activeEvent: { type: Boolean },
    },
    invites: [{
        userid: { type: String },
        count: { type: Number, default: 0 },
        code: { type: [String], default: [] }
    }],
    ticket: {
        channelconfig: { type: String },
        channellog: { type: String },
        categoryId: { type: String },
        rolemodId: { type: [String] },
        userId: { type: String }
    },
    verification: {
        channelconfig: { type: String },
        channellog: { type: String },
        roleverificationId: { type: String }
    },
    autorole:{
        roleId: { type: String },
        activeEvent: { type: Boolean },
    }
}))
