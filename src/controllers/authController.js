import { body, validationResult } from "express-validator/check"
import { auth } from '../services/index'

let getLoginRegister = async (req, res, next) => {
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success")

    })
}

let postRegister = async (req, res) => {

    let errorArr = []
    let successArr = []

    let validateionError = validationResult(req)

    if (!validateionError.isEmpty()) {
        let errors = Object.values(validateionError.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg)
        })
        req.flash("errors", errorArr)
        return res.redirect("/login-register");
    }

    //all ok
    try {
        let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password)
        successArr.push(createUserSuccess)
        req.flash("success", successArr)
        return res.redirect('/login-register')
    } catch (error) {
        errorArr.push(error)
        req.flash("errors", errorArr)
        return res.redirect('/login-register')

    }


}

export default {
    getLoginRegister,
    postRegister
}