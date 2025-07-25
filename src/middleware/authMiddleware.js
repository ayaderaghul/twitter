const User = require('../models/User')
const jwt = require("jsonwebtoken")


module.exports = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) return res.status(401).send("Access Denied")

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        req.user = user
        next()
    } catch(err) {
        res.status(400).send("invalid token")
    }
}