const mongoose = require('mongoose')
const Student = require('../models/student')

const notificationSchema = new mongoose.Schema({
    idSender:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Student,
        require: false
    },
    idReceiver:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Student,
        require: false
    },
    title:{
        type: String,
        require: true,
        validate(v) {
            var valide = false;
            const values = ['New Post', 'New Reply', 'New Answer', 'Like', 'Dislike']
            values.forEach(title => {
                if (title === v) {
                    valide = true
                }
            });
            if (!valide) { throw new Error('Valeur titre du notification non valide') }
        }
    },
    content:{
        type: String,
        require: true
    },
    viewNumber:{
        type: "Number",
        require: false,
        default: 0
    },created: {
        type: Date,
        default: Date.now()
    }
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification;