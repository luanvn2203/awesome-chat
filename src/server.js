require('dotenv').config();

import express from 'express'
// import connectDB from 
import connectDB from "./config/connectDB";

import ContactModel from './models/contact.model'

let app = express()


//connection DB
connectDB()


let hostname = "localhost"
let port = 8017

app.get("/test-database", async (req, res, next) => {
    try {
        let item = {
            userId: "String",
            contactId: "String",
        }
        let contact = await ContactModel.createNew(item)
        res.send(contact)
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Hello, Server running at port ${process.env.APP_PORT} and host ${process.env.APP_HOST}`)
})