import { transError } from '../../lang/vi'
import UserModel from '../models/userModel'
import bcrypt from 'bcrypt'

const saltRound = 7

/**
 * update user Item
 * @param {*} id 
 * @param {*} item 
 * @returns 
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id, item)
}

/**
 * 
 * @param {user_id} id 
 * @param {password object} dataToUpdate 
 * @returns 
 */
let updatePassword =  (id, dataToUpdate) => {
    return new Promise(async (resolve, reject) => {
        let currentUser = await UserModel.findUserById(id)
        console.log(currentUser)
        if (!currentUser) {
            return reject(transError.account_undefined)
        }
        let checkPassword = await currentUser.comparePassword(dataToUpdate.currentPassword)
        if (!checkPassword) {
            return reject(transError.old_password_incorrect)
        }
        let salt =  bcrypt.genSaltSync(saltRound);
        console.log(id,dataToUpdate.newPassword )
        await UserModel.updatePassword(id, bcrypt.hashSync(dataToUpdate.newPassword, salt))
        resolve(true)
    })
}
module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword

}