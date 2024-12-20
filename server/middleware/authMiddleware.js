const jwt = require('jsonwebtoken');

// Middleware to check if the token is valid
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Extract token from the header
    const token = authHeader.split(' ')[1];

    // Verify token with SECRET_KEY or JWT_SECRET
    const decoded = jwt.verify(token, process.env.SECRET_KEY || process.env.JWT_SECRET);

    // Attach decoded user information to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check user role
const authorize = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    return next();
  }
  return res.status(403).json({ message: 'Access forbidden, insufficient permissions' });
};

module.exports = { protect, authorize };
