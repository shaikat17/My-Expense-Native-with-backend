import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Adjust the path as necessary
import envConfig from '../config/envConfig.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

    const token = authHeader.split(' ')[1];
    console.log("🚀 ~ authMiddleware ~ token:", token)
    

  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
      console.error("🚀 ~ authMiddleware ~ error:", error)
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
