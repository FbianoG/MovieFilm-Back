const mongoose = require('mongoose')


const User = mongoose.model('User', {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    like: Array,
})


module.exports = { User }


