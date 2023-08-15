const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

exports.postMessage = asyncHandler(async (req, res, next) => {
  
  const { chatId, content } = req.body; 
  if (!content || !chatId) {
    return next(new ApiError("", 400));
  }
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  };
  var message = await Message.create(newMessage);
  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });
  
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

  res.status(200).json(message)

});

exports.allMessages = asyncHandler(async (req, res, next) => {
  
  var messages = await Message.find({ chat: req.params.chatId })
    .sort({ createdAt: -1 })
    .populate("sender", "name pic")
    .populate("chat");
  messages = await User.populate(messages, {
    path: "chat.users",
    select: "name pic email",
  });

  res.status(200).json(messages);

});

