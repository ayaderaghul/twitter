const { io } = require("socket.io-client");
const socket = io("ws://localhost:5001", {
  transports: ["websocket"],
  forceNew: true
});

socket.on("connect", () => {
  console.log("Connected!", socket.id);
  socket.emit("test", "hello");
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});