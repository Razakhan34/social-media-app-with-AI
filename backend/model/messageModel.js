const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    emotionImage: {
      public_id: String,
      url: String,
    },
    emotionPrediction: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Messages", messageSchema);
module.exports = Message;
