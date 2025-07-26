const User = require('../models/User')
const Notification = require('../models/Notification');

exports.followUser = async (req, res) => {
    try {
        const currentUser = req.user
        const userToFollow = await User.findById(req.params.id)
        if (!userToFollow) return res.status(404).send('User not found')



        // Prevent self-follow
        if (userToFollow._id.toString() === req.user.id) {
            return res.status(400).json({
                error: "You cannot follow yourself",
                code: "SELF_FOLLOW_NOT_ALLOWED"
            });
        }

        // Check if already following
        if (req.user.following.includes(userToFollow._id)) {
            return res.status(400).json({
                error: "You already follow this user",
                code: "ALREADY_FOLLOWING"
            });
        }


        
        req.user.following.push(userToFollow._id)
        userToFollow.followers.push(currentUser)
        await req.user.save()
        await userToFollow.save()

        const notification = new Notification({
            recipient: userToFollow._id,
            sender: req.user.id,
            type: 'follow'
        })
        await notification.save()
        const io = req.app.get('io')
        io.to(userToFollow._id.toString()).emit('notification', notification)

        res.status(200).json({message: 'followed successfully'})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}