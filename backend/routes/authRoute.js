const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {signupValidation,loginValidation}=require('../validators/auth')


router.post('/signup',
  signupValidation,
  authController.signup);

router.post('/login',
  loginValidation,
  authController.login);
router.get('/users',authController.auth ,authController.allUsers);


module.exports = router;