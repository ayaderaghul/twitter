const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Must export like this:
module.exports = mongoose.model('Tweet', tweetSchema);