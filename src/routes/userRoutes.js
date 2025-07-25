const express = require('express');
const router = express.Router();
const {followUser} = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

// Follow/unfollow routes

/**
 * @swagger
 * /api/users/{id}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow
 *     responses:
 *       200:
 *         description: Successfully followed user
 *       404:
 *         description: User not found
 */
router.post('/:id/follow', authMiddleware, followUser);
// router.post('/:id/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;