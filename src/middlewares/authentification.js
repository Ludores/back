const { results } = require('../utils/util')
const jwt = require('jsonwebtoken')
const Student = require('../models/student')
require('dotenv').config()

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '')
        const key = process.env.keyTokens
        const decodedToken = jwt.verify(authToken, key)
        const student = await Student.findOne({ _id: decodedToken._id, 'authTokens.authToken': authToken })

        if (!student) throw new Error

        req.student = student
        req.authToken = authToken

        next();
    } catch (e) {
        const message = "Merci de vous authentifier!"
        res.json(results(message, e))
        res.status(401)

    }

}

module.exports = authentification