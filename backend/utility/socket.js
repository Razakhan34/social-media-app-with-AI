const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.frontend_url],
    methods: ["GET", "POST"],
  },
});
const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReciverSocketId };
