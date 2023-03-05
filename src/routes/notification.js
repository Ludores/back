const Notification = require('../models/notification')

const { Router } = require('express')
const notificationRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const { results } = require('../utils/util.js')

notificationRouter.use(bodyParser.json())
    .use(morgan('dev'))

//ajout un notification
notificationRouter.post('/devHunt2/students/notifications', async (req, res) => {
    const notificationAdd = new Notification(req.body)
    try {
        const resultAdd = await notificationAdd.save()
        const message = `Ajout du notification réussit`
        res.json(results(message, resultAdd))
        res.status(201)
    } catch (e) {
        const message = "Echec ajout notification! "
        res.json(results(message, e))
        res.status(401)
    }
})

//Affiche tous notification
notificationRouter.get('/devHunt2/students/notifications', async (req, res) => {
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

//Affiche un notification
notificationRouter.get('/devHunt2/students/notifications/:id', async (req, res) => {
    const notificationID = req.params.id;

    try {
        const notificationFind = await Notification.findById(notificationID);
        if (!notificationFind) {
            const message = 'Aucun notification de cette identifiant trouvé dans la base de données!'
            res.status(404)
            res.json(results(message, notificationFind))
        }
        else {
            const message = `Le notification a été bien trouvé `
            res.json(results(message, notificationFind))
        }

    } catch (e) {
        const message = "Erreur lors du recherche du notification!"
        res.json(results(message, e))
        res.status(501);
    }
})

//Modification d'un notification
notificationRouter.put('/devHunt2/students/notifications/:id', async (req, res) => {
    const updateInfo = Object.keys(req.body)
    const notificationID = req.params.id;
    try {
        const notificationUpdate = await Notification.findById(notificationID)
        if (!notificationUpdate) {
            res.json(results('Aucun notification de cette identifiant a été trouvé!', notificationUpdate))
            res.status(404)
        }
        updateInfo.forEach(update => notificationUpdate[update] = req.body[update])

        await notificationUpdate.save()

        const message = `Le notification  a été bien mis à jour!`
        res.json(results(message, notificationUpdate))
    } catch (e) {
        const message = "Echec du mis à jour du notification"
        res.json(results(message, e))
    }
})


//suppression d'une notification
notificationRouter.delete('/devHunt2/students/notification/:id', async (req, res) => {
    const notificationID = req.params.id;
    try {
        const notificationDeleted = await Notification.findByIdAndDelete(notificationID)
        if (!notificationDeleted) {
            const message = "Le notification que vous voulez supprimmer n'existe pas!"
            res.json(results(message, notificationDeleted))
            res.status(404)
        }

        const message = `Le notification a été bien supprimmer!`
        res.json(results(message, notificationDeleted))
    } catch (e) {
        const message = "Echec du suppression du notification"
        res.json(results(message, e))
    }
})



module.exports = notificationRouter