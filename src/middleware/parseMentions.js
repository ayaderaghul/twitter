// middlewares/parseMentions.js
const User = require('../models/User')

module.exports = async function parseMentions(req, res, next) {
  try {
    req.mentionedUsers = []; // Initialize as empty array
    
    if (!req.body.content) {
      return next(); // Skip if no content
    }

    const mentionRegex = /@(\w+)/g;
    const matches = req.body.content.match(mentionRegex) || [];
    
    for (const mention of matches) {
      const username = mention.replace('@', '');
      const user = await User.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, 'i') }
      });
      if (user) req.mentionedUsers.push(user._id);
    }

    next();
  } catch (err) {
    next(err);
  }
};