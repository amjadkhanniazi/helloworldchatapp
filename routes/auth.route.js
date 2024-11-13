const express = require('express');
const { signupOrLogin, verifyOTP } = require('../controllers/auth.controller.js');
const router = express.Router();

// Route to send OTP for login or signup
router.post('/signup-login', signupOrLogin);

// Route to verify OTP and login
router.post('/verify-otp', verifyOTP);

module.exports = router;
