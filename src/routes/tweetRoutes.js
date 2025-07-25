const express = require ('express')

const {createTweet} = require('../controllers/tweetController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()
router.post('/',authMiddleware, createTweet)

module.exports = router