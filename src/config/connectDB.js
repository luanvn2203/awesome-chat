require('dotenv').config();
import mongoose, { mongo } from 'mongoose'
import bluebird from 'bluebird'

/**
 * Connect mongoDB
 */
const  connectDB = () => {
    mongoose.Promise = bluebird;

  

    //connection string
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    return mongoose.connect(URI, { useMongoClient: true });
}

module.exports = connectDB