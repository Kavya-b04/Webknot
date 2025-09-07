import jwt from 'jsonwebtoken';
import { promisePool } from '../config/db.js';

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in database
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, college_id FROM admins WHERE id = ? UNION SELECT id, name, email, college_id FROM students WHERE id = ?',
      [decoded.id, decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin exists
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, college_id FROM admins WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Verify student token
const verifyStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if student exists
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, college_id FROM students WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Access denied. Student privileges required.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export { verifyToken, verifyAdmin, verifyStudent };