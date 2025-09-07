import express from 'express';
const router = express.Router();
import {
  registerForEvent,
  getStudentRegistrations,
  getEventRegistrations,
  cancelRegistration
} from '../controllers/registrationController.js';
import { verifyStudent, verifyAdmin, verifyToken } from '../middleware/auth.js';

// Student routes
router.post('/:eventId', verifyStudent, registerForEvent);
router.get('/student', verifyStudent, getStudentRegistrations);
router.delete('/:eventId', verifyStudent, cancelRegistration);

// Admin routes
router.get('/event/:eventId', verifyAdmin, getEventRegistrations);

export default router;
