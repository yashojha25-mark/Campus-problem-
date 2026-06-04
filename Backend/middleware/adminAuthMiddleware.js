import jwt from 'jsonwebtoken';

const adminProtect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, admin token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.admin = {
      username: decoded.username,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Admin session expired, please login again' });
    }

    return res.status(401).json({ message: 'Invalid admin token' });
  }
};

export { adminProtect };