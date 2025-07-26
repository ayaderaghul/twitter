const { io } = require("socket.io-client");
const dotenv = require('dotenv')

dotenv.config()

const socket = io("http://localhost:5003", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: {
    token: process.env.TOKEN_SP
  }
});

// Enhanced logging
socket.on("connect", () => {
  console.log("✅ Connected ID:", socket.id);
  socket.emit("join", "6884aabdee6903f4800f3681"); 
});

socket.on("unread_notifications", (count) => {
  console.log(`🔔 You have ${count} unread notifications`);
});

socket.on("unread_messages", (count) => {
  console.log(`🔔 You have ${count} unread messages`);
});

socket.on("notification", () => {
    console.log(`🔔 You have a new notification `)
})

socket.on("new message", (msg) => {
    console.log(`🔔 You have a new message from ${msg.sender.username}: `, msg.content)
})

socket.on("connect_error", (err) => {
  console.log("❌ Connection failed:", err.message, err.description);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Disconnected:", reason);
});