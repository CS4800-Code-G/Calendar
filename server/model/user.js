const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    username:
    {
        type: String,
        required: true
    },
    hashedPassword:
    {
        type: String,
        required: true
    },
    phoneNumber:
    {
        type: String,
        required: true
    },
    avatar:
    {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema, 'users')