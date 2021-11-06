require('dotenv').config();

import passport from 'passport'
import passportFacebook from 'passport-facebook'
import { transError, transSuccess } from '../../../lang/vi';
import UserModel from '../../models/userModel'

let facebookStrategy = passportFacebook.Strategy;

let FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
let FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
let FACEBOOK_CALLBACK_URL = process.env.FACEBOOK_CALLBACK_URL

/**
 * Valid user account  type: facebook
 */
let initPassportFacebook = () => {
    passport.use(new facebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"]
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findByFacebookUid(profile.id)
            if (user) {
                return done(null, user, req.flash("success", transSuccess.login_success(user.username)))
            }
            let newUserItem = {
                username: profile.displayName,
                gender: "male",
                local: {
                    isActive: true
                },
                facebook: {
                    uid: profile.id,
                    token: accessToken,
                    email: null
                }
            }
            if (profile.emails) {
                newUserItem.facebook.email = profile.emails[0].value
            }
            if (profile.gender) {
                newUserItem.gender = profile.gender
            }

            let newUser = await UserModel.createNew(newUserItem);
            return done(null, newUser, req.flash("success", transSuccess.login_success(newUser.username)))


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

module.exports = initPassportFacebook