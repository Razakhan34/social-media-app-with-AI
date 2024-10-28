const express = require("express");

const messageController = require("../controller/messageController");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", authUser, messageController.getMessages);
router.post("/send/:id", authUser, messageController.sendMessage);

module.exports = router;
