
require('dotenv').config();

import nodeMailer from 'nodemailer'

let adminEmail = process.env.MAIL_USER
let adminEmailPassword = process.env.MAIL_PASSWORD
let mailHost = process.env.MAIL_HOST
let mailPort = process.env.MAIL_PORT

let sendMail = (to, subject, htmlContent) =>{
    let transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // cau hinh ssl - tls
        auth:{
            user: adminEmail,
            pass: adminEmailPassword
        }
    })
    console.log(adminEmail,adminEmailPassword)
    let options = {
        from: adminEmail,
        to: to,
        subject: subject,
        html: htmlContent
    }

    return transporter.sendMail(options) // default return a Promise
}

module.exports = sendMail