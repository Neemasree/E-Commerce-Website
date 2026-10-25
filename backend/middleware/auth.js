const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET is missing or too short; refusing to authenticate requests.');
    return res.status(503).json({ message: 'Authentication is not configured' });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
};

module.exports = { authenticateToken, requireAdmin };
