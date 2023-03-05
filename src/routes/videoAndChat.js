const { Router } = require('express')
const liveRouter = new Router()

const appLive = require('express')()
const http = require('http').createServer(appLive);
const io = require('socket.io')(http);

const bodyParser = require('body-parser')
const morgan = require('morgan')

const Video = require('../models/video');
const ChatLive = require('../models/chatLive')

liveRouter.use(bodyParser.json())
    .use(morgan('dev'))

liveRouter.post('devHunt2/students/live', async (req, res) => {
    // Gestion de la connexion d'un nouveau client Socket.io
    io.on('connection', (socket) => {
        console.log('New user connected');

        // Marquer l'utilisateur comme un spectateur par défaut
        socket.isPublisher = false;

        // Lorsqu'un utilisateur demande de devenir éditeur
        socket.on('becomePublisher', function () {
            // Autoriser seulement un utilisateur à être éditeur à la fois
            if (!io.publisher) {
                io.publisher = socket;
                socket.isPublisher = true;
            }
        });

        // Gestion de la réception de la vidéo en direct
        socket.on('stream', (data) => {
            if (socket.isPublisher) {
                const filename = `video-${Date.now()}.webm`;
                const filepath = `./videos/${filename}`;

                // Enregistrement de la vidéo sur le disque
                const stream = fs.createWriteStream(filepath);
                stream.write(data);
                stream.on('finish', () => {
                    console.log('Video saved to disk');

                    // Enregistrement de l'information de la vidéo dans MongoDB
                    const video = new Video({
                        title: 'My video',
                        description: 'This is my video',
                        filename: filename,
                        mimetype: 'video/webm',
                    });
                    video.save((err, video) => {
                        if (err) {
                            console.log('Error saving video to MongoDB:', err);
                        } else {
                            console.log('Video saved to MongoDB:', video);
                        }
                    });
                });
            }

            //---------------------   Gestion chat pendant live --------------//
            socket.on('chat message', (message, student) => {
                const chatLive = new ChatLive({
                    title: student.name + " " + student.secondName,
                    content: message,
                    idSender: student.id
                })
                chatLive.save()
            })
        });




        // Gestion de la déconnexion d'un client Socket.io
        socket.on('disconnect', () => {
            console.log('User disconnected');
            if (io.publisher === socket) {
                delete io.publisher;
            }
        });
    });
})

module.exports= liveRouter