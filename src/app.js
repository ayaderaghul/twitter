const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const http = require('http')
const socketIo = require('socket.io')


const authRoutes = require('./routes/authRoutes')
const tweetRoutes = require('./routes/tweetRoutes')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes');

const Notification = require('./models/Notification')
const Message = require('./models/Message')


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
      schemas: {
    Tweet: {
      // ... existing properties ...
      mentions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/User"
        }
      }
    },
    Message: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          example: '65a1b2c3d4e5f6a7b8c9d0e1'
        },
        sender: {
          $ref: '#/components/schemas/User'
        },
        recipient: {
          $ref: '#/components/schemas/User'
        },
        content: {
          type: 'string',
          example: 'Hello there!'
        },
        read: {
          type: 'boolean',
          example: false
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2023-12-13T10:00:00.000Z'
        }
      }
    },
    PaginatedMessages: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        count: {
          type: 'integer',
          example: 15
        },
        page: {
          type: 'integer',
          example: 1
        },
        pages: {
          type: 'integer',
          example: 1
        },
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Message'
          }
        }
      }
    }
  }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


const app = express()
const server = http.createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust as needed
    methods: ["GET", "POST"]
  }
});

// Add this before io.on('connection')
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.id; // Attach user ID to socket
    next();
  });
});



io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("join", async (userId) => {
    socket.join(userId); // Adds socket to a room named after user ID
  // Fetch unread count from DB and send immediately
  const unreadCount = await Notification.countDocuments({
      recipient: userId, 
      read: false
    });
    socket.emit("unread_notifications", unreadCount);

    const unreadMessages = await Message.countDocuments({
      recipient: userId, 
      read: false
    });
    socket.emit("unread_messages", unreadMessages);
  
  });

  // Private messaging
  socket.on('private message', async ({ recipientId, content }) => {
    try {
      // 1. Save to database
      const message = new Message({
        sender: socket.userId,
        recipient: recipientId,
        content
      });
      await message.save();

      // 2. Emit to recipient
      io.to(recipientId).emit('private message', message);
      
      // 3. Send back to sender for UI update
      socket.emit('private message', message);

    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
      console.error('Message error:', err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.set('io', io)

app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use((req, res, next) => {
  console.log('Incoming body:', req.body); // Debug log
  next();
});

app.use('/api/auth', authRoutes)
app.use('/api/tweets', tweetRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes);

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