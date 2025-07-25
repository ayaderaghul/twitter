const express = require ('express')

const {getTweets, createTweet} = require('../controllers/tweetController')
const {likeTweet} = require('../controllers/likeController')

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
 *   get:
 *     summary: Get all tweets (timeline)
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Tweets per page
 *     responses:
 *       200:
 *         description: List of tweets (newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tweet'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a1d4f8e9b10f9c8b4567
 *         content:
 *           type: string
 *           example: "Hello Twitter world!"
 *         author:
 *           $ref: '#/components/schemas/User'
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["65f1a1d4f8e9b10f9c8b4567"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-12T14:30:00.000Z"
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1a1d4f8e9b10f9c8b4567
 *         username:
 *           type: string
 *           example: "johndoe"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 */
router.get('/',authMiddleware, getTweets)

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


/**
 * @swagger
 * /api/tweets/{id}/like:
 *   post:
 *     summary: Like/unlike a tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tweet ID to like/unlike
 *     responses:
 *       200:
 *         description: Tweet like status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tweet'
 *       401:
 *         description: Unauthorized (invalid/missing token)
 *       404:
 *         description: Tweet not found
 */
router.post('/:id/like', authMiddleware, likeTweet)

module.exports = router