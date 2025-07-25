const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const authRoutes = require('./routes/authRoutes')
const tweetRoutes = require('./routes/tweetRoutes')
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

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/tweets', tweetRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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