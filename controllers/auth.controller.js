const User = require('../models/user.models.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Utility function to generate OTP
const generateOTP = () => crypto.randomBytes(3).toString('hex'); // 6-character alphanumeric OTP

// Send OTP to email
const sendOTPEmail = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'islamgk0897@gmail.com',
      pass: 'zolx uraw wdgr xyuj',
    },
  });

  await transporter.sendMail({
    from: '"OTP Login" islamgk0897@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
};

// Sign up or Login logic
exports.signupOrLogin = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    //let nameuser = await User.findOne({ username });
    if (!user) {
      // User doesn't exist, so create a new user
      user = new User({ email });
    }

    // Generate OTP and set expiration (5 minutes from now)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 30 * 60 * 1000; // 30 min

    await user.save();

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP and generate JWT token
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token (valid for 30 minutes)
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30m' });

    res.json({token: token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
