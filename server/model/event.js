const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    startTime:
    {
        type: String,
        required: true
    },
    endTime:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        required: true
    },
    _private:
    {
        type: Boolean
    },
    color:
    {
        type: String
    }
})

module.exports = mongoose.model('Event', eventSchema, 'events')