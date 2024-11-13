const jwt = require('jsonwebtoken');
const User = require('../models/user.models.js');

// Middleware to authenticate JWT token
exports.protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = await User.findById(decoded.id).select('-otp -otpExpires');  // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
