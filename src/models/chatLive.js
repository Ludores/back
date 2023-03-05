const mongoose = require('mongoose');

const chatLiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  idSender:{
      type: mongoose.SchemaTypes.ObjectId,
      require:true
  },
  created: { type: Date, default: Date.now },
});

const ChatLive = mongoose.model('ChatLive', chatLiveSchema);

module.exports = ChatLive;