const mongoose = require('mongoose')
const CONFIG = require("../config/config")


// connect to mongodb
function connectToMongoDB() {

    mongoose.set("strictQuery", false);
    mongoose.connect(CONFIG.MONGODB_URL)

    mongoose.connection.on('connected', () => {
        console.log('MongoDb Connection Successful! ')
    })

    mongoose.connection.on('error', (err) => {
        console.log('An error occured', err)
    })
}

module.exports =  { connectToMongoDB }

