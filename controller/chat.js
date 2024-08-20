const express = require("express");
const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server);

// io.on("connection", (socket) => {
//   console.log("A user connected");
// });

const Chat = require("../models/chat");

exports.addMessage = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        message: "Please provide message",
        success: false,
      });
    }
    const newMessage = await Chat.create({
      userId,
      message,
    });

    return res.status(201).json({
      message: "Message Sent",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

exports.replyMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        message: "Please provide userId and message",
        success: false,
      });
    }
    const adminId = req.user.userId;
    const chat = await Chat.create({
      userId,
      message,
      adminId,
    });

    return res.status(201).json({
      message: "Message Sent Successfully",
      success: true,
      data: chat,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.user;
    const messages = await Chat.find({
      userId,
      permanentDeleted: false,
    });

    return res.status(200).json({
      message: "Messages fetched successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
