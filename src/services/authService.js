require('dotenv').config();

import UserModel from '../models/userModel'
import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'
import { transError, transSuccess, transMail } from '../../lang/vi'
import sendMail from '../config/mailer'


let saltRounds = 7;


let register = (email, gender, password, protocol, host) => {
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
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`
        //send email
        sendMail(email, transMail.subject, transMail.template(linkVerify))
            .then(success => {
                resolve(transSuccess.userCreated(email))
            })
            .catch(async error => {
                //xoa user when email gui khong thanh cong
                await UserModel.removeById(user._id)
                console.log(error)
                reject(transMail.sendFailed)
            })

    })
}

let verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
       const userFound  = await UserModel.findByToken(token)
       if(!userFound){
        return reject(transError.token_undefined)
       }
        await UserModel.verifyUser(token)
        return resolve(transSuccess.accountActived)
    })
}

module.exports = {
    register: register,
    verifyAccount: verifyAccount
}