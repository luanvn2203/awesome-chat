export const transValidation = {
    email_incorrect: "Invalid email format (example@nhutluan.com)",
    gender_incorrect: "Gender is Male or Female.",
    password_incorrect: "Password at least 8 character within upper,lower case, number, and special chars.",
    password_confirmation_incorrect: "Confirmation password must equal to password."
}

export const transError = {
    account_in_use: "Email is used by someone.",
    account_removed_before: "You account is removed before, please contact admin for more information.",
    account_registered_but_not_active: "Account has register before but not active."
}

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Account <strong>${userEmail}</strong> has registered, please check you email address to activate account before login, thank you.`
    }
}