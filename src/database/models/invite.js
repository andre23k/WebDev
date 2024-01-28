import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('Invites', new Schema({
    userid: { type: String },
    count: { type: Number, default: 0 },
}
))
