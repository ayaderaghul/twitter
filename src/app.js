const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const http = require('http')
const socketIo = require('socket.io')

const authRoutes = require('./routes/authRoutes')
const tweetRoutes = require('./routes/tweetRoutes')
const userRoutes = require('./routes/userRoutes')
dotenv.config()


const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Twitter-like API",
      version: "1.0.0",
      description: "A simple Twitter-like API with Node.js, Express, and MongoDB",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",  // Temporary (replace with your frontend URL later)
    methods: ["GET", "POST"]
  }
});

app.set('io', io)

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/tweets', tweetRoutes)
app.use('/api/users', userRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to mongodb"))
    .catch(err => console.error("mongodb connection error:", err))


app.get("/", (req, res) => {
    res.send("witter API")
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`server + websocket running on http:localhost:${PORT}`)
})