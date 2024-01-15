import Mongoose from 'mongoose'
const { Schema, model } = Mongoose

export default model('Invites', new Schema({
    userID: { type: String},
    codeURL: { type: String },
    invitercount: { type: String }
}
))
