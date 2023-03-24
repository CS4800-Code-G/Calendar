const express = require('express')
const router = express.Router()
const Channel = require('../model/channel')

// Getting all channels
router.get('/', async (req, res) => {
    try {
        const channels = await Channel.find()
        res.json(channels)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting a channel by id
router.get('/:id', getChannel, (req, res) => {
    res.send(res.channel)
})

// Creating a channel
router.post('/', async (req,res) => {
    const channel = new Channel( {
        _id: req.body._id,
        channelName: req.body.channelName,
    })
    try {
        const newChannel = await channel.save()
        res.status(201).json(newChannel)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating a channel
router.patch('/:id', getChannel, async (req,res) => {
    if (req.body._id != null) {
        res.channel._id = req.body._id
    }
    if (req.body.channelName != null) {
        res.channel.channelName = req.body.channelName
    }
    try {
        const updatedChannel = await res.channel.save()
        res.json(updatedChannel)
    } catch (err) {
        res.status(400).json({ message: err.message } )
    }
})

// Deleting a channel
router.delete('/:id', getChannel, async (req,res) => {
    try {
        const deletedChannel = await res.channel.deleteOne()
        res.json(deletedChannel)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getChannel(req, res, next) {
    let channel;
    try {
        channel = await Channel.findById(req.params.id)
        if (channel == null) {
            return res.status(404).json({ message: 'Cannot find channel' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.channel = channel
    next()
}

module.exports = router