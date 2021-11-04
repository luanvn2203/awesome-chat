import { body, validationResult } from "express-validator/check"

let getLoginRegister = async (req, res, next) => {
    return res.render("auth/master")
}

let postRegister = (req, res) => {

    let errorArr = []

    let validateionError = validationResult(req)

    if (!validateionError.isEmpty()) {
        let errors = Object.values(validateionError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg)
        })
        console.log(errorArr)
        return 
    }
    console.log(req.body)


}

export default {
    getLoginRegister,
    postRegister
}