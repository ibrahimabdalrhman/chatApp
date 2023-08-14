const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Chat = require('../models/chatModel');
const User = require('../models/userModel');


exports.accessChat = asyncHandler(async (req, res, next) => {

  const userId = req.body.userId;

  if (!userId) {
        return next(new ApiError("userId not send wth request", 401));
  }

  var isChat = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    selet: "name , pic , email"
  });

  if (isChat.length > 0) {
    res.send(isChat[0])
  } else {

    var chatData = {
      chatName: "sender",
      isGroup: false,
      users:[req.user._id,userId]
    }
    const createChat = await Chat.create(chatData);

    const fullchat = await Chat.findById(createChat._id).populate("users", "-password");

    res.status(200).json(fullchat);

  }


});

exports.fetchChat = asyncHandler(async (req, res, next) => {
  
  const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
  const results = await User.populate(chats, {
    path: "latestMessage.sender",
    select: 'name pic email'
  });

  res.status(200).json(

    results
  );
  
});

exports.createGroup = asyncHandler(async (req, res, next) => {
  
  if (!req.body.users || !req.body.name) {
    return next(
      new ApiError("please fill all the fields", 400)
    );
  }
  var users = req.body.users;

  users.push(req.user);

  const groupChat = await Chat.create({
    name: req.body.name,
    users: users,
    isGroup: true,
    groupAdmin: req.user
  });

  const fullGroupChat = await Chat.findById(groupChat._id)
    .populate('users', '-password')
    .populate('groupAdmin', '-password');
  
  res.status(201).json(fullGroupChat);


});

exports.renameGroup = asyncHandler(async (req, res, next) => {
  
  const updateGroup = await Chat.findByIdAndUpdate(req.body.chatId, {
    name: req.body.name
  }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  res.status(201).json(

    updateGroup
  )

});

exports.addToGroup = asyncHandler(async (req, res, next) => {

  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(201).json( added);

});

exports.removeFromGroup = asyncHandler(async (req, res, next) => {

  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(201).json( added);

});


exports.removeGroup  = asyncHandler(
  async (req, res, next) => {
    const { chatId, userId } = req.body;

    const remooved = await Chat.findByIdAndRemove(chatId);
    res.status(201).json();
  }
);