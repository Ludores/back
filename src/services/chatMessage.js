const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('New user connected');
  
    // Gestion de la réception d'un nouveau message
    socket.on('chat message', (msg) => {
      console.log('Message received: ' + msg);
  
      // Diffusion du message à tous les clients connectés
      io.emit('chat message', msg);
    });
  
    // Gestion de la déconnexion d'un client
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });