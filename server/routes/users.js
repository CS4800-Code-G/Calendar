const express = require('express')
const router = express.Router()
const User = require('../model/user')

// Getting all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting a user by id
router.get('/:id', getUser, (req, res) => {
    res.send(res.user)
})

// Creating a user
router.post('/', async (req,res) => {
    const user = new User( {
        username: req.body.username,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating a user
router.patch('/:id', getUser, async (req,res) => {
    if (req.body.username != null) {
        res.user.username = req.body.username
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message } )
    }
    
})

// Deleting a user
router.delete('/:id', getUser, async (req,res) => {
    try {
        const deletedUser = await res.user.deleteOne()
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}

module.exports = router