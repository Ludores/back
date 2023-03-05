const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const app = express();

app.get('/download', (req, res) => {
  const folderPath = 'path/to/folder'; // Chemin vers le dossier à télécharger
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
