// controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc   Send a message to another user
 * @route  POST /api/chat/messages
 * @access Private
 */

exports.sendMessage = async(req, res) => {
    try {
        const {content} = req.body
        const {recipientId} = req.params

        const recipient = await User.findById(recipientId)
        if (!recipient) {
            return res.status(404).json({
                success:false,
                error: 'Recipient not found'
            })
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success:false,
                error: 'Message content is required'
            })
        }

        const message = await Message.create({
            sender: req.user._id,
            recipient: recipientId,
            content: content.trim()
        })

        const populatedMessage = await Message.populate(message, {
            path: 'sender',
            select: 'username'
        })

        const io = req.app.get('io')
        io.to(recipientId).emit('new message', populatedMessage)

        res.status(201).json({
            success: true,
            data: populatedMessage
        })

    } catch(err) {
        console.error('send message error:', err)
        res.status(500).json({
            success: false,
            error: 'failed to send message',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        })
    }
}



/**
 * @desc    Get chat history between two users
 * @route   GET /api/chat/:otherUserId
 * @access  Private
 */
exports.getChatHistory = async (req, res) => {
  try {
    // 1. Validate other user exists
    const otherUser = await User.findById(req.params.otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // 2. Get messages (paginated)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.otherUserId },
        { sender: req.params.otherUserId, recipient: req.user._id }
      ]
    })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar');

    // 3. Mark messages as read
    await Message.updateMany(
      {
        sender: req.params.otherUserId,
        recipient: req.user._id,
        read: false
      },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      page,
      pages: Math.ceil(messages.length / limit),
      data: messages.reverse() // Oldest first in response
    });

  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};