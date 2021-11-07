import UserModel from '../models/userModel'

/**
 * update user Item
 * @param {*} id 
 * @param {*} item 
 * @returns 
 */
let updateUser = (id, item) => {
    return UserModel.updateUser(id, item)
}

module.exports = {
    updateUser: updateUser
}