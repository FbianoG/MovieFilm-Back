const mongoose = require('mongoose')
require('dotenv').config()


async function ConnectDataBase() {
    try {
        await mongoose.connect(process.env.URL_DATABASE)
        console.log('DataBase connected')
    } catch (error) {
        console.log(error)
    }
}



module.exports = { ConnectDataBase }