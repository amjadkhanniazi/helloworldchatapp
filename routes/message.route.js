const express = require('express');
const { sendMessage, getMessages } = require('../controllers/message.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const router = express.Router();

// Route to send a message
router.post('/send', protect, sendMessage);

// Route to get messages between two users
router.post('/get', protect, getMessages);

module.exports = router;
