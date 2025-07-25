const express = require ('express')

const {createTweet} = require('../controllers/tweetController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Tweets
 *   description: Tweet management
 */

/**
 * @swagger
 * /api/tweets:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tweet created successfully
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */
router.post('/',authMiddleware, createTweet)

module.exports = router