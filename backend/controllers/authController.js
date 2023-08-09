const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const ApiError = require('../utils/apiError');


const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });


exports.signup = asyncHandler(async (req, res, next) => {
  
  const user = await User.create(req.body);
  const token = createToken(user._id);

  res.status(201).json({
    status: true,
    message: "create a new user",
    user,
    token
  })
}
);


exports.login = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("incorrect email", 401));
  }
  if (await bcrypt.compare(req.body.password, user.password)) {
    const token = createToken(user._id);
    return res.status(200).json({
      status: true,
      user,
      token,
    });
  }
  return next(new ApiError("incorrect password", 401));

});


