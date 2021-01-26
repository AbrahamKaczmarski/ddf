const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['admin', 'gameMaster', 'player', 'reader'],
        default: ['reader']
    }
})

module.exports = mongoose.model('user', userSchema, 'users')
