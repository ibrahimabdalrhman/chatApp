const express = require("express");
const router = express.Router();

const chatsController = require("../controllers/chatsController");
const { auth } = require('../controllers/authController');


router.post('/', auth, chatsController.accessChat);
router.get('/', auth, chatsController.fetchChat);

router.post('/create-group', auth, chatsController.createGroup);
router.put('/rename-group', auth, chatsController.renameGroup);
router.put('/add-to-group', auth, chatsController.addToGroup);
router.put('/remove-from-group', auth, chatsController.removeFromGroup);
router.delete('/remove-group', auth, chatsController.removeGroup);


module.exports = router;
