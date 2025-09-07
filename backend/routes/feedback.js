import express from 'express';
const router = express.Router();
import {
  submitFeedback,
  getEventFeedback,
  getStudentFeedback,
  getFeedbackStats,
  submitFeedbackValidation
} from '../controllers/feedbackController.js';
import { verifyStudent, verifyAdmin, verifyToken } from '../middleware/auth.js';

// Student routes
router.post('/:eventId', verifyStudent, submitFeedbackValidation, submitFeedback);
router.get('/student', verifyStudent, getStudentFeedback);

// Admin routes
router.get('/event/:eventId', verifyAdmin, getEventFeedback);
router.get('/stats/:eventId', verifyToken, getFeedbackStats);

export default router;
