import express from 'express';
const router = express.Router();
import {
  markAttendance,
  getEventAttendance,
  getStudentAttendance,
  getAttendanceStats,
  markAttendanceValidation
} from '../controllers/attendanceController.js';
import { verifyAdmin, verifyStudent, verifyToken } from '../middleware/auth.js';

// Admin routes
router.post('/:eventId/:studentId', verifyAdmin, markAttendanceValidation, markAttendance);
router.get('/event/:eventId', verifyAdmin, getEventAttendance);
router.get('/stats/:eventId', verifyToken, getAttendanceStats);

// Student routes
router.get('/student', verifyStudent, getStudentAttendance);

export default router;
