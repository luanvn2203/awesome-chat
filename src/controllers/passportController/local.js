import passport from 'passport'
import passportLocal from 'passport-local'
import { transError, transSuccess } from '../../../lang/vi';
import UserModel from '../../models/userModel'

let localStrategy = passportLocal.Strategy;

/**
 * Valid user account  type: local
 */
let initPassportLocal = () => {
    passport.use(new localStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback:true
    }, async (req, email, password, done) => {
        try {
            let user = await UserModel.findByEmail(email)

            if (!user) {
                return done(null, false, req.flash("errors", transError.login_failed))
            }
            if (!user.local.isActive) {
                return done(null, false, req.flash("errors", transError.account_registered_but_not_active))
            }
            let checkPassword = await user.comparePassword(password)
            if (!checkPassword) {
                return done(null, false, req.flash("errors", transError.login_failed))
            }
            return done(null, user, req.flash("success", transSuccess.login_success(user.username)))

        } catch (error) {
            console.log(error)
            return done(null, false, req.flash("errors", transError.server_error))
        }
    }))

    //ghi thong tin user vao session trong mongoDB
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        UserModel.findUserById(id)
            .then(user => {
                return done(null, user)
            })
            .catch(error => {
                return done(error, null)
            })
    })

}

module.exports = initPassportLocal