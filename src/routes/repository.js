const Repository = require('../models/repository')
const Student = require('../models/student')

const { Router } = require('express')
const repositoryRouter = new Router()

const bodyParser = require('body-parser')
const morgan = require('morgan')

const fs = require('fs');
const multer = require('multer');
const path = require('path');
const archiver = require('archiver');



// Configuration de multer pour gérer les fichiers envoyés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/repository'); // Dossier de destination pour les fichiers uploadés
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Nom de fichier unique
    }
});
const upload = multer({ storage });


repositoryRouter.use(bodyParser.json())
    .use(morgan('dev'))

//tâche à faire: upload folder/ download folder / download file
// Route pour uploader le dossier et add repository
repositoryRouter.post('/devHunt2/students/repository/uploads/:idStudent', upload.any(), (req, res) => {
    //add repository in database
    const repositoryAdd = new Repository({
        title: req.body.title,
        explanation: req.body.explanation,
        folderName: req.file.filename
    })
    const student = Student.findById(req.params.idStudent)
    student.idRepository = repositoryAdd.id;
    student.save()

    res.send('Dossier uploadé avec succès !');
});

repositoryRouter.get('/devHunt2/students/repository/download', (req, res) => {
    const folderPath = 'data/repository/'; // Chemin vers le dossier à télécharger
    const folderName = path.basename(folderPath); // Nom du dossier

    // Créer un fichier zip pour le dossier
    const zipFilePath = `${folderName}.zip`;
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Compression de niveau maximum
    });

    // Ajouter le contenu du dossier dans le zip
    archive.directory(folderPath, false);

    // Écrire le zip sur le disque
    archive.pipe(output);

    // Fin de l'archivage
    archive.finalize();

    // Envoyer le zip au client une fois qu'il est créé
    output.on('close', () => {
        res.download(zipFilePath, () => {
            // Supprimer le fichier zip après le téléchargement
            fs.unlink(zipFilePath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
    });
});

//download file
repositoryRouter.get('/devHunt2/students/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = __dirname + '/data/repository/' + filename;
    res.download(filepath);
});

module.exports = repositoryRouter