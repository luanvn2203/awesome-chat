import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: String,
    gender: { type: String, default: "male" },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: String,
        isActive: { type: Boolean, default: false },
        verifyToken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: null },
    deletedAt: { type: Number, default: null }
})

UserSchema.statics = {
    createNew(item) {
        return this.create(item)
    },
    findByEmail(email) {
        console.log(email)
        return this.findOne({ "local.email": email }).exec();
    },
    removeById(id) {
        return this.findByIdAndRemove(id).exec()
    },
    verifyUser(token) {
        return this.findOneAndUpdate(
            { "local.verifyToken": token },
            { "local.isActive": true, "local.verifyToken": null }
        ).exec()
    },
    findByToken(token) {
        return this.findOne({ "local.verifyToken": token })
    },
    findUserById(id){
        return this.findById(id).exec()
    }
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compare(password, this.local.password) // return true or false (PROMISE)
    }
}

//STATICS chi nam o pham vi Schema
//goi den cac phuong thuc khac thi can dung METHODS

module.exports = mongoose.model("user", UserSchema)