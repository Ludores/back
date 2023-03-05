const Post = require('../models/post')
const Student = require('../models/student')
const Answer = require('../models/answer')
const Notification = require('../models/notification')

const { Router } = require('express')
const postRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const { results } = require('../utils/util.js')


const appChat = require('express')()
const server = require('http').createServer(appChat)
const io = require('socket.io')(server)


postRouter.use(bodyParser.json())
    .use(morgan('dev'))

//Ajout un post
postRouter.post('/devHunt2/students/posts', async (req, res) => {
    const postAdd = new Post(req.body)
    try {
        const resultAdd = await postAdd.save()
        const message = `Ajout du post réussit`
        const studentPost = await Student.findById(postAdd.idStudent)

        //notifié tous les étudiants
        const allStudents = await Student.find({})
        allStudents.forEach(student => {
            const notificationPost = new Notification({
                idSender: studentPost.id,
                idReceiver: student.id,
                title: "New Post",
                content: `${studentPost.name} ${studentPost.secondName} a publié une question!`
            })
            notificationPost.save()
        });


        //démarrer un chat quand un post est créé; avec nom évènement (id+titrePost)
        io.on('connection', (socket) => {
            console.log("un étudiant est connecté dans la discution");
            socketEventName = postAdd.id + postAdd.title

            socket.on(socketEventName, (content, studentAnswer)=> {
                //ajout réponse dans la base de donnée
                const answer = new Answer({
                    idSender: studentAnswer.id,
                    idPost: postAdd.id,
                    content: content
                })
                //enregistrement dans la base de donnée
                answer.save()

                //notifié tous les étudiants
                allStudents.forEach(student => {
                    const notificationAnswer = new Notification({
                        idSender: answer.idStudent,
                        idReceiver: student.id,
                        title: "New Answer",
                        content: `${student.name} ${student.secondName} a répondu la une question!`
                    })
                    notificationAnswer.save()
                });
            })

            socket.on('disconnect', () => {
                console.log("Un étudiant s'est déconnnecter du chat!");
            })

        })

        res.json(results(message, resultAdd))
        res.status(201)
    } catch (e) {
        const message = "Echec ajout post! "
        res.json(results(message, e))
        res.status(401)
    }
})

//Affiche tous posts
postRouter.get('/devHunt2/students/posts', async (req, res) => {
    try {
        const allPost = await Post.find({})
        const message = `La liste des post a été bien envoyer! `
        res.json(results(message, allPost))
    } catch (e) {
        const message = 'Echec affichage liste des posts!'
        res.json(results(message, e))
        res.status(501)
    }
})

//Affiche tous posts d'un étudiant
postRouter.get('/devHunt2/students/posts/:idStudent', async (req, res) => {
    const idStudent = req.params.idStudent
    try {
        const allPostOfStudent = await Post.find().where("idStudent").equals(idStudent)
        const message = `La liste des post de l'étudiant a été bien envoyer! `
        res.json(results(message, allPostOfStudent))
    } catch (e) {
        const message = 'Echec affichage liste des posts de l\'étudiant!'
        res.json(results(message, e))
        res.status(501)
    }
})


//Affiche un post
postRouter.get('/devHunt2/students/posts/:id', async (req, res) => {
    const postID = req.params.id;

    try {
        const postFind = await Post.findById(postID);
        if (!postFind) {
            const message = 'Aucun post de cette identifiant trouvé dans la base de données!'
            res.status(404)
            res.json(results(message, postFind))

        }
        else {
            const message = `Le post a été bien trouvé `
            res.json(results(message, postFind))
        }

    } catch (e) {
        const message = "Erreur lors du recherche du post!"
        res.json(results(message, e))
        res.status(501);
    }
})

//Modification d'un post
postRouter.put('/devHunt2/students/posts/:id', async (req, res) => {
    const updateInfo = Object.keys(req.body)
    const postId = req.params.id;
    try {
        const postUpdate = await Post.findById(postId)
        if (!postUpdate) {
            res.json(results('Aucun post de cette identifiant a été trouvé!', postUpdate))
            res.status(404)
        }
        updateInfo.forEach(update => postUpdate[update] = req.body[update])

        await postUpdate.save()

        const message = `Le post  a été bien mis à jour!`
        res.json(results(message, postUpdate))
    } catch (e) {
        const message = "Echec du mis à jour du post"
        res.json(results(message, e))
    }
})


//suppression d'un post
postRouter.delete('/devHunt2/students/post/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const postDeleted = await Post.findByIdAndDelete(postId)
        if (!postDeleted) {
            const message = "Le post que vous voulez supprimmer n'existe pas!"
            res.json(resultat(message, postDeleted))
            res.status(404)
        }

        const message = `Le post a été bien supprimmer!`
        res.json(results(message, postDeleted))
    } catch (e) {
        const message = "Echec du suppression du post"
        res.json(results(message, e))
    }
})



module.exports = postRouter 