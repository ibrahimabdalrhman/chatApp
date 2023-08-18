const bcrypt = require("bcryptjs");
const { param, check, body } = require("express-validator");
const validationMiddleware = require("../middlewares/validationMiddleware");
const User = require("../models/userModel");


exports.signupValidation = [
  check("name")
    .notEmpty()
    .withMessage("user name required")
    .isLength({ min: 3 })
    .withMessage("too short user name"),
  check("email")
    .notEmpty()
    .withMessage("user email required")
    .isEmail()
    .withMessage("invalied email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("user already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("user password required")
    .isLength({ min: 6 })
    .withMessage("too short user password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage(" password Confirm required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        return Promise.reject(new Error("password confiration incorrect"));
      }
      return true;
    }),
  check("pic").optional(),
  validationMiddleware,
];


exports.loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("user email required")
    .isEmail()
    .withMessage("invalied email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("user already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("user password required")
    .isLength({ min: 6 })
    .withMessage("too short user password"),

  validationMiddleware,
];


