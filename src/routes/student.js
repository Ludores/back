const Student = require('../models/student')
const fs= require('fs')

const authentification = require('../middlewares/authentification')

const { Router ,static} = require('express')
const studentRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const { results } = require('../utils/util')
const multer = require('multer')

//config multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./data/pictures/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
}).single("picture");



studentRouter.use(bodyParser.json())
    .use(morgan('dev'))
    .use(static('data'))

//ajout un étudiant
studentRouter.post('/devHunt2/students', upload, async (req, res,next) => {
    const nameFile='';
    if(req.file){
        nameFile="/picture/"+req.file.filename
    }

    const studentAdd = new Student({
        name: req.body.name,
        secondName: req.body.secondName,
        serialNumber: req.body.serialNumber,
        picture: nameFile,
        level: req.body.level,
        course: req.body.course,
        passWord: req.body.passWord,
        avertismentNumbers: req.body.avertismentNumbers
    })
    try {
        await studentAdd.save()
        const authToken = await studentAdd.generateAuthTokenAndSave()
        const message = `Ajout de l'étudiant réussit`
        res.json(results(message, { studentAdd, authToken }))
        res.status(201)
    } catch (e) {
        const message = "Echec ajout étudiant! "
        res.json(results(message, e))
        res.status(401)
    }
})

//Affiche tous étudiants
studentRouter.get('/devHunt2/students', async (req, res) => {
    try {
        const allStudent = await Student.find({})
        const message = `La liste des ${allStudent.length} étudiant(s) a été bien envoyer! `
        res.json(results(message, allStudent))
    } catch (e) {
        const message = 'Echec affichage liste des étudiants!'
        res.json(results(message, e))
        res.status(501)
    }
})

//affiche profil étudiant connecté
studentRouter.get('/devHunt2/students/me', authentification, async (req, res) => {
    try {
        const studentConnected = req.student;
        const message = `Le profil de ${studentConnected.name} ${studentConnected.secondName} a été bien envoyer! `
        res.json(results(message, studentConnected))
    } catch (e) {
        const message = 'Echec affichage profile étudiant!'
        res.json(results(message, console.error(e)))
        res.status(501)
    }
})

//Affiche un étudiant
studentRouter.get('/devHunt2/students/:id', async (req, res, next) => {
    const studentID = req.params.id;

    try {
        const studentFind = await Student.findById(studentID);
        if (!studentFind) {
            const message = 'Aucun étudiant de cette identifiant trouvé dans la base de données!'
            res.status(404)
            res.json(results(message, studentFind))

        }
        else {
            const message = `L'étudiant  a été bien trouvé `
            res.json(results(message, userFind))
        }

    } catch (e) {
        const message = "Erreur lors du recherche de l'étudiant!"
        res.json(results(message, e))
        res.status(501);
    }
})

//Modification d'un étudiant
studentRouter.put('/devHunt2/students/:id', upload,async (req, res,next) => {
    const updateInfo = Object.keys(req.body)
    const studentId = req.params.id;
    let newPicture=''
    
    try {
        const studentUpdate = await Student.findById(studentId)
        if (!studentUpdate) {
            res.json(results('Aucun étudiant de cette identifiant a été trouvé!', {}))
            res.status(404)
        }

        if(req.file){
            newPicture= req.file.filename;
            try {
                fs.unlinkSync("../data/pictures/"+req.body.oldPicture)
            } catch (e) {
                console.log(e);
            }
        }
        else{
            newPicture= req.body.oldPicture;
        }

        updateInfo.forEach((update) =>{
            studentUpdate[update] = req.body[update]
        })

        studentUpdate.picture= newPicture

        await studentUpdate.save();

        const message = `L'étudiant a été bien mis à jour!`
        res.json(results(message, studentUpdate))
    } catch (err) {
        const message = "Echec du mis à jour de l'étudiant"
        console.error(err);
        res.json(results(message, err))
    }
})


//suppression d'un utilisateur
studentRouter.delete('/devHunt2/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const studentDeleted = await Student.findByIdAndDelete(studentId)
        if (!studentDeleted) {
            const message = "L'étudiant que vous voulez supprimmer n'existe pas!"
            res.json(results(message, studentDeleted))
            res.status(404)
        }

        const message = `L'étudiant a été bien supprimmer!`
        res.json(results(message, studentDeleted))
    } catch (e) {
        const message = "Echec du suppression de l'étudiant"
        res.json(results(message, e))
    }
})


//connexion
studentRouter.post('/devHunt2/login', async (req, res) => {
    //se connecter avec num_matricule et mot de passe
    try {
        const student = await Student.findLogin(req.body.serialNumber, req.body.passWord);
        const authToken = await student.generateAuthTokenAndSave()
        req.authToken = authToken
        const message = `L'étudinant ${student.name} ${student.secondName} est maintenant connecté!`

        res.json(results(message, { student, authToken }))
    } catch (e) {
        res.json(results('Erreur login', console.error(e)))
        res.status(404).send()
    }

})

//déconnexion
studentRouter.post('/devHunt2/students/logout', authentification, async (req, res) => {
    try {
        req.student.authTokens = req.student.authTokens.filter((objToken) => {
            return objToken.authToken !== req.authToken;
        })

        await req.student.save()

        const message = "L'étudiant a été bien déconnecté!"
        res.json(results(message, {}))
    } catch (e) {
        res.json(results('Erreur logout', e))
        res.status(404).send()
    }
})

module.exports = studentRouter    