export const transValidation = {
    email_incorrect: "Invalid email format (example@nhutluan.com)",
    gender_incorrect: "Gender is Male or Female.",
    password_incorrect: "Password at least 8 character within upper,lower case, number, and special chars.",
    password_confirmation_incorrect: "Confirmation password must equal to password."
}

export const transError = {
    account_in_use: "Email is used by someone.",
    account_removed_before: "You account is removed before, please contact admin for more information.",
    account_registered_but_not_active: "Account has registered before but not active.",
    token_undefined: "Token is expired or undefined",
    login_failed: "Email or password is incorrect",
    server_error: "Internal server error, try again."
}

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Account <strong>${userEmail}</strong> has registered, please check you email address to activate account before login, thank you.`
    },
    accountActived: "Activate account successfully, you can login now.",
    login_success: (username) => {
        return `Hello ${username}, have a nice day.`
    },
    logout_success: "See you again."
}

export const transMail = {
    subject: "[Luanvn dev] - Account activation - AWESOME CHAT",
    template: (linkVerify) => {
        return `
        <h2>You receive this email because of registered account on AWESOME CHAT application.</h2>
        <h3>Please click here to activate your account: <a href="${linkVerify}">Click Here</a> </h3>
        <h4>If you think this email is a mistake, please ignore this email.</h4>
        <h4>Thank you.</h4>`
    },
    sendFailed: "Something wrong when sending activation email, please contact admin for more information."
}