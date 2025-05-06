const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Please log in again.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'david'; // Ensure the secret matches the one used during token signing
    const decoded = jwt.verify(token, secret); // Use the correct secret
    console.log('Decoded Token:', decoded);

    const user = await Admin.findById(decoded.id);
    console.log('Admin fetched from DB:', user); // Debug log

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'User is not an admin or does not exist' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyAdmin;
