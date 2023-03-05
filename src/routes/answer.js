const Answer = require('../models/answer')

const { Router } = require('express')
const answerRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const { results } = require('../utils/util.js')

answerRouter.use(bodyParser.json())
    .use(morgan('dev'))

//Ajout une reponse
answerRouter.post('/devHunt2/students/posts/answer', async (req, res) => {
    const answerAdd = new Answer(req.body)
    try {
        const resultAdd = await answerAdd.save()
        const message = `Ajout du réponse réussit`
        res.json(results(message, resultAdd))
        res.status(201)
    } catch (e) {
        const message = "Echec ajout réponse! "
        res.json(results(message, e))
        res.status(401)
    }
})

//Affiche tous réponse
answerRouter.get('/devHunt2/students/posts/answers', async (req, res) => {
    try {
        const allAnswer = await Answer.find({})
        const message = `La liste des réponses a été bien envoyer! `
        res.json(results(message, allAnswer))
    } catch (e) {
        const message = 'Echec affichage liste des réponses!'
        res.json(results(message, e))
        res.status(501)
    }
})

//Affiche tous réponse du même question
answerRouter.get('/devHunt2/students/posts/answers/:idPost', async (req, res) => {
    const idPost = req.body.idPost
    try {
        const allAnswerSamePost = await Answer.find().where("idPost").equals(idPost)
        const message = `La liste des réponses de ce post a été bien envoyer! `
        res.json(results(message, allAnswerSamePost))
    } catch (e) {
        const message = 'Echec affichage liste des réponses du post!'
        res.json(results(message, e))
        res.status(501)
    }
})

//Affiche un post
answerRouter.get('/devHunt2/students/posts/answers/:id', async (req, res) => {
    const answerID = req.params.id;

    try {
        const answerFind = await Answer.findById(answerID);
        if (!answerFind) {
            const message = 'Aucun réponse de cette identifiant trouvé dans la base de données!'
            res.status(404)
            res.json(results(message, answerFind))

        }
        else {
            const message = `Le réponse a été bien trouvé `
            res.json(results(message, answerFind))
        }

    } catch (e) {
        const message = "Erreur lors du recherche du réponse!"
        res.json(results(message, e))
        res.status(501);
    }
})

//Modification d'un réponse
answerRouter.put('/devHunt2/students/posts/answer/:id', async (req, res) => {
    const updateInfo = Object.keys(req.body)
    const answerId = req.params.id;
    try {
        const answerUpdate = await Answer.findById(answerId)
        if (!answerUpdate) {
            res.json(results('Aucun réponse de cette identifiant a été trouvé!', answerUpdate))
            res.status(404)
        }
        updateInfo.forEach(update => answerUpdate[update] = req.body[update])

        await answerUpdate.save()

        const message = `Le réponse  a été bien mis à jour!`
        res.json(results(message, answerUpdate))
    } catch (e) {
        const message = "Echec du mis à jour du réponse"
        res.json(results(message, e))
    }
})

//suppression d'une réponse
answerRouter.delete('/devHunt2/students/post/answers/:id', async (req, res) => {
    const answerID = req.params.id;
    try {
        const answerDeleted = await Answer.findByIdAndDelete(answerID)
        if (!answerDeleted) {
            const message = "Le réponse que vous voulez supprimmer n'existe pas!"
            res.json(results(message, answerDeleted))
            res.status(404)
        }

        const message = `Le réponse a été bien supprimmer!`
        res.json(resultat(message, answerDeleted))
    } catch (e) {
        const message = "Echec du suppression du réponse"
        res.json(results(message, e))
    }
})



module.exports = answerRouter 