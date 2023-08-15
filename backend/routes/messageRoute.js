const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { auth } = require("../controllers/authController");


router.post("/", auth, messageController.postMessage);
router.get("/:chatId", auth, messageController.allMessages);


module.exports = router;
