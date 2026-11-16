const express = require("express");
const router = express.Router();

const chatbotController = require("../../controllers/client/chatbot.controllers");

router.post("/chat", chatbotController.chat);

module.exports = router;
