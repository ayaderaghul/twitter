const Tweet = require('../models/Tweet')

exports.getTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate('author', 'username')
            .sort({createdAt: -1})

        res.status(200).json(tweets)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

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