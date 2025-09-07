import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import Student from '../models/Student.js';
import College from '../models/College.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Admin Signup
const adminSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, college_id } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Verify college exists
    const college = await College.findById(college_id);
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    // Create admin
    const adminId = await Admin.create({ name, email, password, college_id });
    const admin = await Admin.findById(adminId);

    const token = generateToken(adminId);

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        college_id: admin.college_id
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Server error during admin signup' });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Test credentials for demo
    if (email === 'admin@test.com' && password === 'password123') {
      const token = generateToken(1);
      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: 1,
          name: 'Test Admin',
          email: 'admin@test.com',
          role: 'admin',
          college_id: 1
        }
      });
    }

    // Try database login
    try {
      const admin = await Admin.findByEmail(email);
      if (!admin) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await Admin.verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(admin.id);

      res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'admin',
          college_id: admin.college_id
        }
      });
    } catch (dbError) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// Student Signup
const studentSignup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, college_id } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Verify college exists
    const college = await College.findById(college_id);
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    // Create student
    const studentId = await Student.create({ name, email, password, college_id });
    const student = await Student.findById(studentId);

    const token = generateToken(studentId);

    res.status(201).json({
      message: 'Student created successfully',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        college_id: student.college_id
      }
    });
  } catch (error) {
    console.error('Student signup error:', error);
    res.status(500).json({ message: 'Server error during student signup' });
  }
};

// Student Login
const studentLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Test credentials for demo
    if (email === 'student@test.com' && password === 'password123') {
      const token = generateToken(2);
      return res.json({
        message: 'Student login successful',
        token,
        user: {
          id: 2,
          name: 'Test Student',
          email: 'student@test.com',
          role: 'student',
          college_id: 1
        }
      });
    }

    // Try database login
    try {
      const student = await Student.findByEmail(email);
      if (!student) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await Student.verifyPassword(password, student.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(student.id);

      res.json({
        message: 'Student login successful',
        token,
        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          college_id: student.college_id
        }
      });
    } catch (dbError) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error during student login' });
  }
};

// Validation rules
const adminSignupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('college_id').isInt().withMessage('Valid college ID is required')
];

const adminLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const studentSignupValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('college_id').isInt().withMessage('Valid college ID is required')
];

const studentLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export {
  adminSignup,
  adminLogin,
  studentSignup,
  studentLogin,
  adminSignupValidation,
  adminLoginValidation,
  studentSignupValidation,
  studentLoginValidation
};
