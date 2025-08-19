const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

let waitingUser = null;

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  if (waitingUser) {
    // Room banake dono ko connect kar do
    const roomId = waitingUser.id + "#" + socket.id;
    socket.join(roomId);
    waitingUser.join(roomId);

    socket.emit("joined", roomId);
    waitingUser.emit("joined", roomId);

    waitingUser = null;
  } else {
    waitingUser = socket;
  }

  // Message exchange
  socket.on("message", ({ roomId, text }) => {
    io.to(roomId).emit("message", { text, sender: socket.id });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (waitingUser && waitingUser.id === socket.id) {
      waitingUser = null;
    }
    io.emit("stranger-disconnected");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(process.env.PORT || 3000, () => {
  console.log("✅ Server running");
});
