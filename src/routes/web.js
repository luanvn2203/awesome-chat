import express from 'express'
import passport from 'passport';
import { auth, home, user } from '../controllers/index'
import { authValid, userValid } from '../validation/index'
import initPassportLocal from '../controllers/passportController/local';
import initPassportFacebook from '../controllers/passportController/facebook';


//init all passport
initPassportLocal()
initPassportFacebook()

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module (server.js)
 */
let initRoutes = (app) => {

    router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister)
    router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister)
    router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount)
    router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login-register",
        successFlash: true,
        failureFlash: true
    }))

    router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }))
    router.get("/auth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/login-register",
    }))
    router.get("/", auth.checkLoggedIn, home.getHome)
    router.get("/logout", auth.checkLoggedIn, auth.getLogout)
    router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar)
    router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfor, user.updateInfo)
    router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updateUserPassword)

    return app.use("/", router)
}

module.exports = initRoutes