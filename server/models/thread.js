const mongoose = require('mongoose')

const Schema = mongoose.Schema

const threadSchema = new Schema({
    identifier: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        default: "../../assets/img/placeholder.jpg"
    },
    description:
    {
        type: String,
        required: true
    },
    nPosts: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model('thread', threadSchema, 'threads')
