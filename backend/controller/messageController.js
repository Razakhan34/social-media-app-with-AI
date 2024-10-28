const Conversation = require("../model/conversationModel.js");
const Message = require("../model/messageModel.js");
const { getReciverSocketId, io } = require("../utility/socket.js");
const cloudinary = require("cloudinary");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // images upload to cloudinary
    let images = [];
    images = req.body.images;

    // if (typeof req.body.images === "string") {
    //   // if we get only one image
    //   images.push(req.body.images);
    // } else {
    //   images = req.body.images;
    // }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "social/chat",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;

    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let converstaion = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });
    if (!converstaion) {
      converstaion = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      message,
      images: req.body.images,
    });
    if (newMessage) {
      converstaion.messages.push(newMessage._id);
    }
    // await converstaion.save();
    // await newMessage.save();
    // this will run in parallel
    await Promise.all([converstaion.save(), newMessage.save()]);
    // * SOCKET IO FUNCTIONALITY
    const reciverSockedId = getReciverSocketId(reciverId);
    if (reciverSockedId) {
      io.to(reciverSockedId).emit("newMessage", newMessage);
    }
    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res
      .status(500)
      .json({ success: false, error: "internal server error", err: error });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("error in getMessage controller", error);
    res.status(500).json({ success: false, error: "internal server error" });
  }
};
