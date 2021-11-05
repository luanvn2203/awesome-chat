require('dotenv').config();

import express from 'express'
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash'
import configSession from './config/session'
import connectDB from "./config/connectDB";
import configViewEngine from './config/viewEngine'
import initRoutes from './routes/web'
import passport from 'passport'
//Init APP
let app = express()

//Connection DB
connectDB()

//Config session on mongoDB
configSession(app)

//Config view engine
configViewEngine(app)

//Config body parser for post data request
app.use(bodyParser.urlencoded({ extended: true }))

//Enable flash message
app.use(connectFlash())

//config passport JS
app.use(passport.initialize())
app.use(passport.session())

//Config router
initRoutes(app)

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Hello, Server running at port ${process.env.APP_PORT} and host ${process.env.APP_HOST}`)
})