import { body, validationResult } from 'express-validator';
import Feedback from '../models/Feedback.js';
import Event from '../models/Event.js';

// Submit Feedback (Student)
const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.params;
    const { rating, comments } = req.body;
    const studentId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if student is from the same college as the event
    if (event.college_id !== req.user.college_id) {
      return res.status(403).json({ message: 'You can only submit feedback for events from your college' });
    }

    const feedbackId = await Feedback.create({
      event_id: eventId,
      student_id: studentId,
      rating,
      comments
    });

    res.json({
      message: 'Feedback submitted successfully',
      feedbackId
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error during feedback submission' });
  }
};

// Get Event Feedback (Admin)
const getEventFeedback = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const feedback = await Feedback.findByEventId(eventId);
    const stats = await Feedback.getFeedbackStats(eventId);

    res.json({
      message: 'Event feedback retrieved successfully',
      event,
      feedback,
      stats
    });
  } catch (error) {
    console.error('Get event feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching event feedback' });
  }
};

// Get Student Feedback
const getStudentFeedback = async (req, res) => {
  try {
    const studentId = req.user.id;

    const feedback = await Feedback.findByStudentId(studentId);

    res.json({
      message: 'Student feedback retrieved successfully',
      feedback
    });
  } catch (error) {
    console.error('Get student feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching student feedback' });
  }
};

// Get Feedback Statistics for Event
const getFeedbackStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const stats = await Feedback.getFeedbackStats(eventId);

    res.json({
      message: 'Feedback statistics retrieved successfully',
      event,
      stats
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback statistics' });
  }
};

// Validation rules
const submitFeedbackValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comments').optional().isString().withMessage('Comments must be a string')
];

export {
  submitFeedback,
  getEventFeedback,
  getStudentFeedback,
  getFeedbackStats,
  submitFeedbackValidation
};
