

io.on('connection', function (socket) {
    console.log('Un utilisateur s\'est connecté');
  
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
  
    // Lorsqu'un utilisateur envoie un flux vidéo
    socket.on('stream', function (data) {
      // Autoriser seulement les éditeurs à envoyer des flux vidéo
      if (socket.isPublisher) {
        socket.broadcast.emit('stream', data);
      }
    });
  
    // Lorsqu'un utilisateur arrête d'envoyer un flux vidéo
    socket.on('disconnect', function () {
      console.log('Un utilisateur s\'est déconnecté');
  
      // Si l'utilisateur qui se déconnecte est l'éditeur, supprimer cette marque
      if (io.publisher === socket) {
        delete io.publisher;
      }
    });
  });
  