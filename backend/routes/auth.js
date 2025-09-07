// @ts-ignore
import express from 'express';
const router = express.Router();
import {
  adminSignup,
  adminLogin,
  studentSignup,
  studentLogin,
  adminSignupValidation,
  adminLoginValidation,
  studentSignupValidation,
  studentLoginValidation,
} from '../controllers/authController.js';

// Admin routes
router.post('/admin/signup', adminSignupValidation, adminSignup);
router.post('/admin/login', adminLoginValidation, adminLogin);

// Student routes
router.post('/student/signup', studentSignupValidation, studentSignup);
router.post('/student/login', studentLoginValidation, studentLogin);

export default router;
