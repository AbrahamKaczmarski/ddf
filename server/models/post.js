const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    threadId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    heroId: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: false
    }
})

module.exports = mongoose.model('post', postSchema, 'posts')
