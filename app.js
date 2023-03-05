const { connectDb } = require('./src/services/connectMongoose')

require('dotenv').config()
const studentRouter = require('./src/routes/student')
const postRouter= require('./src/routes/post')
const answerRouter= require('./src/routes/answer')
const notificationRouter= require('./src/routes/notification')
const tagRouter= require('./src/routes/tag')
const repositoryRouter= require('./src/routes/repository')
const liveRouter= require('./src/routes/videoAndChat')

const cors = require('cors')


const express = require('express')
const app = express()
const port = process.env.port

connectDb().catch(err => { console.log(err); })


app.use(express.json())
    .use(studentRouter)
    .use(postRouter)
    .use(answerRouter)
    .use(notificationRouter)
    .use(tagRouter)
    .use(repositoryRouter)
    .use(liveRouter)
    .use(cors())


app.listen(port, () => {
    console.log(`L'application est démarer sur http://localhost:${port} !`);
})