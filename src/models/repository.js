const mongoose = require('mongoose')

const repositorySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    explanation: {
        type: String,
        require: true
    },
    folderName: {
        type: String,
        require: true
    },
    reportNumber: {
        type: Number,
        default: 0
    },
    likeNumber: {
        type: Number,
        default: 0
    },
    dislikeNumber: {
        type: Number,
        default: true
    },created: {
        type: Date,
        default: Date.now()
    }
})

const Repository = mongoose.model('Repository', repositorySchema)

module.exports = Repository;