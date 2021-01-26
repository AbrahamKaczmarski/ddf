const mongoose = require('mongoose')

const Schema = mongoose.Schema

const heroSchema = new Schema({
    playerId: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        default: "hero"
    }
})

module.exports = mongoose.model('hero', heroSchema, 'heroes')
