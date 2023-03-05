const mongoose= require('mongoose')

const tagSchema= new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        require: true
    }
})

const Tag= mongoose.model('Tag',tagSchema)

module.exports= Tag
