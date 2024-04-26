const express = require('express')
const router = require('./src/routes/router.js')
const DataBase = require('./src/dataBase/db.js')
require('dotenv').config()
const cors = require('cors')


const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

DataBase.ConnectDataBase()
app.listen(port, () => {
    console.log(`Servidor funcionando: http://localhost:` + port)
})