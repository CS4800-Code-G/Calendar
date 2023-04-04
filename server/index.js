const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth.js')

const app = express()
const PORT = process.env.PORT || 5000

require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID
const twilioClient = require('twilio')(accountSid, authToken)

app.use(cors());
app.use((req, res, next) => {
    //res.setHeader('Access-Control-Allow-Origin', 'http://18.183.252.141:3000');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
app.use(express.json())
app.use(express.urlencoded())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const eventsRouter = require('./routes/events')
app.use('/events', eventsRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const channelsRouter = require('./routes/channels')
app.use('/channels', channelsRouter)

const _dirname = path.dirname('')
const buildPath = path.join(_dirname, '../client/build')

app.use(express.static(buildPath))

app.get('/', function(req, res) {
    res.sendFile(
        path.join(__dirname, '../client/build/index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    )
})

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body

    if (type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if (!user.online) {
                    twilioClient.message.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch(err => console.log(err))
                }
            })

            return res.status(200).send('Message sent!')
    }

    return res.status(200).send('Not a new message request')
})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))