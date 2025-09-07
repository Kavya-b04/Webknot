import express from 'express';
const router = express.Router();
import {
  getPopularityReport,
  getAttendanceReport,
  getFeedbackReport,
  getStudentReport,
  getTopStudentsReport,
  getDashboardReport
} from '../controllers/reportController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

// Admin routes
router.get('/popularity', verifyAdmin, getPopularityReport);
router.get('/attendance/:eventId', verifyAdmin, getAttendanceReport);
router.get('/feedback/:eventId', verifyAdmin, getFeedbackReport);
router.get('/student/:studentId', verifyAdmin, getStudentReport);
router.get('/top-students', verifyAdmin, getTopStudentsReport);
router.get('/dashboard', verifyAdmin, getDashboardReport);

export default router;
