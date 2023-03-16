const express = require('express')
const router = express.Router()
const Event = require('../model/event')

// Getting all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
        res.json(events)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one event by id
router.get('/:id', getEvent, (req, res) => {
    res.send(res.event)
})

// Creating one event
router.post('/', async (req,res) => {
    const event = new Event( {
        date: req.body.date,
        title: req.body.title,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        location: req.body.location,
        _private: req.body._private,
        color: req.body.color
    })
    try {
        const newEvent = await event.save()
        res.status(201).json(newEvent)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one event
router.patch('/:id', getEvent, async (req,res) => {
    if (req.body.title != null) {
        res.event.title = req.body.title
    }
    if (req.body.date != null) {
        res.event.date = req.body.date
    }
    if (req.body.startTime != null) {
        res.event.startTime = req.body.startTime
    }
    if (req.body.endTime != null) {
        res.event.endTime = req.body.endTime
    }
    if (req.body.location != null) {
        res.event.location = req.body.location
    }
    if (req.body._private != null) {
        res.event._private = req.body._private
    }
    if (req.body.color != null) {
        res.event.color = req.body.color
    }

    try {
        const updatedEvent = await res.event.save()
        res.json(updatedEvent)
    } catch (err) {
        res.status(400).json({ message: err.message } )
    }
    
})

// Deleting one event
router.delete('/:id', getEvent, async (req,res) => {
    try {
        const deletedEvent = await res.event.deleteOne()
        res.json(deletedEvent)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getEvent(req, res, next) {
    let event;
    try {
        event = await Event.findById(req.params.id)
        if (event == null) {
            return res.status(404).json({ message: 'Cannot find event' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.event = event
    next()
}

module.exports = router