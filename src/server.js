require('dotenv').config();

import express from 'express'
import connectDB from "./config/connectDB";
import configViewEngine from './config/viewEngine'
import initRoutes from './routes/web'
//Init APP
let app = express()

//Connection DB
connectDB()

//Config view engine
configViewEngine(app)


//Config router
initRoutes(app)

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Hello, Server running at port ${process.env.APP_PORT} and host ${process.env.APP_HOST}`)
})