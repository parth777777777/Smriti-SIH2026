const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants.js');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ message: "Access token missing or invalid format" });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decodedUser;
    next();
  });
}

const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  }
  next();
};



module.exports = { authenticateToken, requireRole };