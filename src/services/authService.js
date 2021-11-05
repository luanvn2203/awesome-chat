import UserModel from '../models/userModel'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'
import { transError, transSuccess } from '../../lang/vi'
import { reject } from 'bluebird';
let saltRounds = 7;


let register = (email, gender, password) => {
    return new Promise(async (resolve, reject) => {
        let userByEmail = await UserModel.findByEmail(email)
        if (userByEmail) {
            if (userByEmail.deletedAt != null) {
                return reject(transError.account_removed_before)
            }
            if (!userByEmail.local.isActive) {
                return reject(transError.account_registered_but_not_active)
            }
            return reject(transError.account_in_use)
        }
        let salt = bcrypt.genSaltSync(saltRounds)

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        }
        let user = await UserModel.createNew(userItem)
        resolve(transSuccess.userCreated(email))

    })
}

module.exports = {
    register: register
}