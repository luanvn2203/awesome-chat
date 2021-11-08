import multer from 'multer'
import { transError, transSuccess } from '../../lang/vi'
import { app } from '../config/app'
import uuidv4 from 'uuid/v4'
import { user } from '../services/index'
import fsExtra from 'fs-extra'
import { validationResult } from "express-validator/check"


let storageAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, app.avatar_directory) //tham so loi va success
    },
    filename: (req, file, callback) => {
        let match = app.avatar_type
        if (match.indexOf(file.mimetype) === -1) {
            return callback(transError.avatar_type_error, null)
        }
        let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`
        callback(null, avatarName);
    }
})   //noi se upload anh len tren ung dung

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: { fileSize: app.avatar_max_size } //byte
}).single("avatar")

let updateAvatar = (req, res) => {
    avatarUploadFile(req, res, async (error) => {
        if (error) {
            if (error.message) {
                return res.status(500).send(transError.avatar_size)
            }
            return res.status(500).send(error)
        }
        try {
            let updateUserItem = {
                avatar: req.file.filename,
                updatedAt: Date.now()
            }
            //update user avatar
            let userUpdated = await user.updateUser(req.user._id, updateUserItem);
            //update xong van tra ve du lieu user cu
            //remove old avatar
            await fsExtra.remove(`${app.avatar_directory}/${userUpdated.avatar}`)
            let result = {
                message: transSuccess.info_update_succes,
                imageSrc: `/images/users/${req.file.filename}`
            };
            return res.status(200).send(result);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })
}

let updateInfo = async (req, res) => {
    let errorArr = []
    let validateionError = validationResult(req)
    if (!validateionError.isEmpty()) {
        let errors = Object.values(validateionError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg)
        })

        return res.status(500).send(errorArr)
    }
    try {
        let updateUserItem = req.body;
        await user.updateUser(req.user._id, updateUserItem);
        let result = {
            message: transSuccess.info_update_succes,
        };
        return res.status(200).send(result);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

let updateUserPassword = async (req, res) => {
    let errorArr = []
    let validateionError = validationResult(req)

    if (!validateionError.isEmpty()) {
        let errors = Object.values(validateionError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg)
        })
        req.flash("errors", errorArr)
        return res.status(500).send(errorArr)
    }
    try {
        let updateUserItem = req.body
        await user.updatePassword(req.user.id, updateUserItem)
        let result = {
            message: transSuccess.user_password_updated
        }
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send(error)
    }
}

module.exports = {
    updateAvatar: updateAvatar,
    updateInfo: updateInfo,
    updateUserPassword: updateUserPassword
}