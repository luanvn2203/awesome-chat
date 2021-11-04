import mongoose from 'mongoose'

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    reveiver: {
        id: String,
        username: String,
        avatar: String
    },
    type: String,
    content: String,
    isRead: { type: Boolean, default: false },
    createdAt: { type: Number, default: Date.now },
})


module.exports = mongoose.model("message", MessageSchema)