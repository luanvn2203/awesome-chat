import { body, validationResult } from "express-validator/check"
import { transSuccess } from "../../lang/vi"
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
        let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host"))
        successArr.push(createUserSuccess)
        req.flash("success", successArr)
        return res.redirect('/login-register')
    } catch (error) {
        errorArr.push(error)
        req.flash("errors", errorArr)
        return res.redirect('/login-register')

    }
}

let verifyAccount = async (req, res, next) => {
    let errorArr = []
    let successArr = []
    try {
        const verifySuccess = await auth.verifyAccount(req.params.token)
        successArr.push(verifySuccess)
        req.flash("success", successArr)
        return res.redirect("/login-register")
    } catch (error) {
        errorArr.push(error)
        req.flash("errors", errorArr)
        return res.redirect("/login-register")
    }
}

let getLogout = async (req, res, next) => {
    req.logout() //remove session passport user trong mongoDB
    req.flash("success", transSuccess.logout_success)
    return res.redirect("/login-register");
}

/**
 * Kiem tra da dang nhap roi thi moi next request vao home
 */
let checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login-register");
    }
    next()
}

/**
 * Kiem tra da dang xuat chua roi thi da ve trang login
 */
let checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next()
}

export default {
    getLoginRegister,
    postRegister,
    verifyAccount,
    getLogout,
    checkLoggedIn,
    checkLoggedOut
}