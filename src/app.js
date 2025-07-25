const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const tweetRoutes = require('./routes/tweetRoutes')
dotenv.config()

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/tweets', tweetRoutes)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.error("mongodb connection error:", err))


app.get("/", (req, res) => {
    res.send("witter API")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server running on http:localhost:${PORT}`)
})