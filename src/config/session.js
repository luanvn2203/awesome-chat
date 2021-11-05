require('dotenv').config();


import session from "express-session";
import connectMongo from "connect-mongo"

let mongoStore = connectMongo(session)

/**
 * This variable is where save session in this case is mongo DB
 */
let sessionStore = new mongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect: true,
    // autoRemove: "native"
})

/**
 * Config session for app
 * @param app from exactly express module (server.js)
 */
let configSession = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "mySecret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false, //giam chi phi du lieu
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //86400000 milisec = 1 day
        }
    }))
}


//default store is PC RAM
//use package connect-mongo => mongoDB

module.exports = configSession