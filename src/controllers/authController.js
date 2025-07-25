const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email, password})
        await user.save()
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
           expiresIn: "1d" 
        })

        res.status(201).json({token})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) throw new Error("User not found")

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new Error("invalid password")
        
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            res.json({token})
    } catch (err) {
        res.status(400).json({error: err.message})
    }

}