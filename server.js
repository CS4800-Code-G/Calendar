require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const favicon = require('serve-favicon')

const port = process.env.PORT || 8080;

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, "public",
        req.url === "/" ? "index.html" : req.url
    ));
});

app.get('/timeslot', function(req,res){
    res.sendFile(path.join(__dirname, "public",
        req.url === "/timeslot" ? "schedular.html" : req.url
    ));
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const eventsRouter = require('./routes/events')
app.use('/events', eventsRouter)

app.listen(port, () => console.log('Server Started'))