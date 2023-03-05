const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Repository= require('../models/repository')
const validator = require('validator')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    secondName: {
        type: String,
        require: true
    },
    serialNumber: {
        type: String,
        require: false,
        unique: true
    },
    email:{
        type: String,
        require: true,
        validate(v){
            if(!validator.isEmail(v)){
                throw new Error('Email non valide!')
            }
        }
    },
    picture: {
        type: String,
        require: false,
        default: ''
    },
    level: {
        type: String,
        require: false,
        validate(v) {
            var valide = false;
            const values = ['L1', 'L2', 'L3', 'M1', 'M2']
            values.forEach(niveau => {
                if (niveau === v) {
                    valide = true
                }
            });
            if (!valide) { throw new Error('Valeur type niveau étudiant non valide') }
        }
    },
    course: {
        type: String,
        require: false,
        validate(v) {
            var valide = false;
            const values = ['PRO', 'IG', 'GB', 'SR']
            values.forEach(parcours => {
                if (parcours === v) {
                    valide = true
                }
            });
            if (!valide) { throw new Error('Valeur parcours étudiant non valide') }
        }
    },
    passWord: {
        type: String,
        require: true,
        default: '0000'
    },
    authTokens: [
        {
            authToken: {
                type: String,
                require: false
            }
        }
    ],
    avertismentNumbers: {
        type: Number,
        require: false,
        default: 0
    },
    created:{
        type: Date,
        default: Date.now()
    },
    idRepository:
    {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: Repository,
        require: false
    }
    
})


studentSchema.methods.generateAuthTokenAndSave = async function () {
    const key = process.env.keyTokens
    try {
        const authToken = jwt.sign({ _id: this._id.toString() }, key)
        this.authTokens.push({ authToken })
        await this.save()
        return authToken

    } catch (e) {
        return e
    }
}

//cree methode pour chercher étudiant à connecter
studentSchema.statics.findLogin = async (serialNumber, passWord) => {
    const student = await Student.findOne({ serialNumber })
    if (!student) {
        throw new Error('Erreur de connection!')
    }
    const isValidePass = await bcrypt.compare(passWord, student.passWord)
    if (!isValidePass) {
        throw new Error('Erreur de connection!')
    }
    return student
}

//crypter mot de passe avant sauvegarde 
studentSchema.pre('save', async function () {
    if (this.isModified('passWord')) {
        this.passWord = await bcrypt.hash(this.passWord, 10);
    }
})


const Student = mongoose.model('Student', studentSchema)

module.exports = Student;