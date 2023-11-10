const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'exam2023';

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await User.find(userId);
    if (!user) {
      return res.status(401).send('The user belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = isAuthenticated;