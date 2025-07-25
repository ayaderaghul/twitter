const Notification = require('../models/Notification')
const Tweet = require('../models/Tweet')

exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id)
        if (!tweet) return res.status(404).send('Tweet not found')

        tweet.likes.push(req.user.id)
        await tweet.save()

        const notification = new Notification({
            recipient: tweet.author,
            sender: req.user.id,
            type: 'like',
            tweet: tweet._id
        })
        await notification.validate()
        await notification.save()
        console.log('Notification saved:', notification._id)

        const io = req.app.get('io')
        io.to(tweet.author.toString()).emit('notification', notification)
        res.status(200).json(tweet)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}