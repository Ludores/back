const { Router } = require('express')
const tagRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const { results } = require('../utils/util.js')

tagRouter.use(bodyParser.json())
    .use(morgan('dev'))

//ajout un tag
tagRouter.post('/devHunt2/tags', async (req, res) => {
    const tagAdd = new Tag(req.body)
    try {
        const resultAdd = await tagAdd.save()
        const message = `Ajout du tag réussit`
        res.json(results(message, resultAdd))
        res.status(201)
    } catch (e) {
        const message = "Echec ajout tag! "
        res.json(results(message, e))
        res.status(401)
    }
})

//Affiche tous tags
tagRouter.get('/devHunt2/tags', async (req, res) => {
    try {
        const allTags = await Tag.find({})
        const message = `La liste des tags a été bien envoyer! `
        res.json(results(message, allTags))
    } catch (e) {
        const message = 'Echec affichage liste des tags!'
        res.json(results(message, e))
        res.status(501)
    }
})

//Affiche un notification
tagRouter.get('/devHunt2/tags/:id', async (req, res) => {
    const tagID = req.params.id;

    try {
        const tagFind = await Tag.findById(tagID);
        if (!tagFind) {
            const message = 'Aucun tag de cette identifiant trouvé dans la base de données!'
            res.status(404)
            res.json(results(message, tagFind))
        }
        else {
            const message = `Le tag a été bien trouvé `
            res.json(results(message, tagFind))
        }

    } catch (e) {
        const message = "Erreur lors du recherche du tag!"
        res.json(results(message, e))
        res.status(501);
    }
})

//Modification d'un tag
tagRouter.put('/devHunt2/tags/:id', async (req, res) => {
    const updateInfo = Object.keys(req.body)
    const tagID = req.params.id;
    try {
        const tagUpdate = await Tag.findById(tagID)
        if (!tagUpdate) {
            res.json(results('Aucun tag de cette identifiant a été trouvé!', tagUpdate))
            res.status(404)
        }
        updateInfo.forEach(update => tagUpdate[update] = req.body[update])

        await tagUpdate.save()

        const message = `Le tag  a été bien mis à jour!`
        res.json(results(message, tagUpdate))
    } catch (e) {
        const message = "Echec du mis à jour du tag"
        res.json(results(message, e))
    }
})


//suppression d'un tag
tagRouter.delete('/devHunt2/tags/:id', async (req, res) => {
    const tagID = req.params.id;
    try {
        const tagDeleted = await Tag.findByIdAndDelete(tagID)
        if (!tagDeleted) {
            const message = "Le tag que vous voulez supprimmer n'existe pas!"
            res.json(results(message, tagDeleted))
            res.status(404)
        }

        const message = `Le tag a été bien supprimmer!`
        res.json(results(message, tagDeleted))
    } catch (e) {
        const message = "Echec du suppression du tag"
        res.json(results(message, e))
    }
})

module.exports = tagRouter