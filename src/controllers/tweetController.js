const Tweet = require('../models/Tweet')

exports.createTweet = async(req,res) => {
    try {
        const {content} = req.body
        const tweet = new Tweet({content, author: req.user.id})
        await tweet.save()
        res.status(201).json(tweet)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}