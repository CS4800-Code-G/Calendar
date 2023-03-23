const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Channel', channelSchema, 'channels')