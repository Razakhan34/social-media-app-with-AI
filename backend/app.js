const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const messageRouter = require("./routes/messageRouter");
dotenv.config();

const cors = require("cors");
const { app, server } = require("./utility/socket");

const corsOptions = {
  origin: process.env.frontend_url, // Set this to the exact frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
};
app.use(cors(corsOptions));

// Define the rate limit options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes - The duration of the window in milliseconds
  max: 100000, // Max number of requests allowed within the window
  message: "Too many requests from this IP, please try again later.", // Error message sent when limit is exceeded
});

// // Apply the rate limiter to all requests
app.use(limiter);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "backend/config/config.env" });
}

// Using Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// Using Router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/messages", messageRouter);

// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

// if the url doesn't match
app.get("*", (req, res) => {
  res.status(404).json({
    error: "Page not found",
    code: 404,
  });
});

module.exports = app;
