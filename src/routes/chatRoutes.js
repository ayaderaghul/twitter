// routes/chatRoutes.js
const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
console.log('sendMessage type:', typeof sendMessage); // Should be 'function'
console.log(typeof authMiddleware)

// routes/chatRoutes.js
/**
 * @swagger
 * /api/chat/{recipientId}/messages:
 *   post:
 *     summary: Send a message to a specific user
 *     description: Create and deliver a private message to the specified user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message recipient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hello there!"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Recipient not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:recipientId/messages', authMiddleware, sendMessage);
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Private messaging endpoints
 */

/**
 * @swagger
 * /api/chat/{otherUserId}:
 *   get:
 *     summary: Get chat history with a user
 *     description: Retrieve paginated messages between authenticated user and another user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the other user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Messages per page
 *     responses:
 *       200:
 *         description: Successful response with messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 15
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:otherUserId', authMiddleware, getChatHistory);

module.exports = router;