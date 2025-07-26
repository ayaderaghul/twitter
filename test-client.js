const { io } = require("socket.io-client");

const socket = io("http://localhost:5003", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ODRhYWJkZWU2OTAzZjQ4MDBmMzY4MSIsImlhdCI6MTc1MzUyNDkyNiwiZXhwIjoxNzUzNjExMzI2fQ.U9yDDvLP1YlIRPnT2ebW_armIg6t1PKlp-QG96_nOVI" // If using auth
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