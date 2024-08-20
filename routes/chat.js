const express = require("express");
const chatRoutes = express.Router();
const userAuth = require("../middleware/userAuth");

const checkAdmin = require("../middleware/Adminauth");
const { addMessage, replyMessage, getMessages } = require("../controller/chat");

chatRoutes.post("/createMessage", userAuth, addMessage);
chatRoutes.post("/replyMessage", userAuth, checkAdmin, replyMessage);
chatRoutes.get("/getmessages", userAuth, getMessages);

module.exports = chatRoutes;
