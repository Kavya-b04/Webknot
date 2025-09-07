import express from 'express';
const router = express.Router();
import {
  createEvent,
  getEventsByCollege,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStats,
  createEventValidation,
  updateEventValidation
} from '../controllers/eventController.js';
import { verifyAdmin, verifyToken } from '../middleware/auth.js';

// Public routes (students can access events for their college)
router.get('/:collegeId', getEventsByCollege);
router.get('/single/:id', getEventById);

// Admin only routes
router.post('/', verifyAdmin, createEventValidation, createEvent);
router.get('/', verifyAdmin, getAllEvents);
router.put('/:id', verifyAdmin, updateEventValidation, updateEvent);
router.delete('/:id', verifyAdmin, deleteEvent);
router.get('/stats/:id', verifyToken, getEventStats);

export default router;
