const app = require("./app");
const { server } = require("./utility/socket");
const connectDB = require("./config/database");
const cloudinary = require("cloudinary");

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// START SERVER

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.info(`Server is running on port ${PORT}`);
  }
});
