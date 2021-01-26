require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const auth = require('./routes/auth')
const threads = require('./routes/threads')
const users = require('./routes/users')

const HOST = process.env.HOST || "localhost"
const PORT = process.env.PORT || 3000
const DB = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}, err =>
{
    if(err)
        console.log("Error connecting to database : " + err)
    else
        console.log("Connected to MongoDB")
})

app.use('/threads', threads)
app.use('/profile', users)
app.use('/', auth)

app.use((req, res, next) =>
{
    res.status(404).send("Page not found");
});

app.listen(PORT, HOST, () =>
{
    console.log(`Server listening on ${HOST}:${PORT}`)
})
