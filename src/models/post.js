const mongoose = require('mongoose')
require('dotenv').config()
const Student = require('../models/student')
const Tags= require('../models/tags')


const postSchema = new mongoose.Schema({
    idStudent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Student,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    code:{
        type: String,
        require: false
    },
    tags: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Tags,
        require: true
    },
    isResolved: {
        type: Boolean,
        require: false,
        default: false
    },
    reportCount: {
        type: Number,
        require: false,
        default: 0
    },
    likeCount: {
        type: Number,
        require: false,
        default: 0
    },
    dislikeCount: {
        type: Number,
        require: false,
        default: 0
    },created: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post;