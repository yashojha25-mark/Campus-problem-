import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // Get the token from the Authorization header.
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    let decoded;
    try {
      // Verify that the token was created using our secret key.
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again' });
      }

      return res.status(401).json({ message: 'Invalid token, authorization failed' });
    }

    // Find the user linked to the token.
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization failed' });
    }

    // Attach the user to the request so protected routes can use it.
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

const optionalAuth = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: null;

		if (!token) {
			return next();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);
		if (user) {
			req.user = user;
		}
	} catch {
		// Ignore invalid tokens for public routes that optionally enrich the request.
	}

	return next();
};

export { protect, optionalAuth };