const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  mentions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isRetweet: { type: Boolean, default: false },
  originalTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
  createdAt: { type: Date, default: Date.now }
});

// Must export like this:
module.exports = mongoose.model('Tweet', tweetSchema);