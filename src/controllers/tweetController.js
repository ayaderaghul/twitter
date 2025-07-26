const Tweet = require('../models/Tweet')
const Notification = require('../models/Notification')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const parseMentions = require('../middleware/parseMentions')

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
        console.log('Request body verification:', {
      content: req.body.content,
      user: req.user // Should show from JWT
    });
        const tweet = await Tweet.create({
            content: req.body.content, 
            author: req.user._id,
            mentions: req.mentionedUsers
        })
        
        const io = req.app.get('io')
        await Promise.all(
            req.mentionedUsers.map(async userId => {
                const notification = await Notification.create({
                    recipient: userId,
                    sender: req.user._id,
                    type: 'mention',
                    tweet: tweet._id,
                    read: false
                })
                io.to(userId.toString()).emit('notification', notification)
            })
        )
        await tweet.save()
        res.status(201).json(tweet)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

exports.retweet = async (req, res) => {
    try {
        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({error: 'invalid tweet id'})
        }

        const originalTweet = await Tweet.findById(req.params.id)
        if (!originalTweet) {
            return res.status(404).send({error: 'Tweet not found'})
        }

        const existingRetweet = await Tweet.findOne({
            author: req.user._id,
            originalTweet: originalTweet._id
        })

        if (existingRetweet) {
            return res.status(400).send({error: 'you already retweeted this tweet'})
        }

        const retweet=new Tweet({
            author: req.user._id,
            content:originalTweet.content,
            isRetweet: true,
            originalTweet: originalTweet._id
        })

        const notification = new Notification({
            recipient: originalTweet.author,
            sender: req.user._id,
            type: 'retweet',
            tweeet: originalTweet._id,
            read: false
        })

        const [savedRetweet, savedNotification] = await Promise.all([
            retweet.save(),
            notification.save()
        ])

        req.app.get('io').to(originalTweet.author.toString()).emit('notification', {
            notification: savedNotification
        })

        res.status(201).send(savedRetweet)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
}