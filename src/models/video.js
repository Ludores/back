const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;