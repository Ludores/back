const notifier = require('node-notifier');
const Audio = require('node-audio');
const audio = new Audio();


notifier.notify({
  title: 'Nouveau message',
  message: 'Vous avez reçu un nouveau message',
  sound: true,
  wait: true
}, (err, response) => {
  if (err) {
    console.error('Erreur lors de l\'envoi de la notification :', err);
  } else {
    console.log('Notification envoyée avec succès !', response);
  }
});
