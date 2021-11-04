require('dotenv').config();

import express from 'express'
import connectDB from "./config/connectDB";
import configViewEngine from './config/viewEngine'

//Init APP
let app = express()

//Connection DB
connectDB()

//Config view engine
configViewEngine(app)

let hostname = "localhost"
let port = 8017

app.get("/", async (req, res, next) => {
    return res.render("main/master")
})
app.get("/login-register", async (req, res, next) => {
    return res.render("auth/loginRegister")
})
app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Hello, Server running at port ${process.env.APP_PORT} and host ${process.env.APP_HOST}`)
})