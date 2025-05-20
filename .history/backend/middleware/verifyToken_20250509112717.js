const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Authorization Header:', req.headers['authorization']); // Log the full Authorization header

  if (!token) {
    console.log('No token provided'); // Log when no token is provided
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token

    const user = await User.findById(decoded.userId);
    console.log('User Retrieved from Database:', user); // Log the user fetched from the database

    if (!user) {
      console.log('User not found in database'); // Log when user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user object to the request object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired at:', error.expiredAt); // Log the expiration time
      return res.status(401).json({ message: 'Token expired', expiredAt: error.expiredAt });
    }
    console.error('Error during token verification:', error); // Log any other errors
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;
