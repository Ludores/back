const mongoose = require('mongoose')
require('dotenv').config()
const Student = require('../models/student')
const Post = require('../models/post')

const answerSchema = new mongoose.Schema({
    idStudent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Student,
        require: true
    },
    idPost: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: Post,
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
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer;