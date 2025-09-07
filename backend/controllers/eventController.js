// @ts-ignore
import { body, validationResult } from 'express-validator';

import Event from '../models/Event.js';
import College from '../models/College.js';

// Create Event (Admin only)
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, type, date, college_id } = req.body;
    const created_by = req.user.id;

    // Verify college exists
    const college = await College.findById(college_id);
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    const eventId = await Event.create({
      title,
      description,
      type,
      date,
      created_by,
      college_id
    });

    const event = await Event.findById(eventId);

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error during event creation' });
  }
};

// Get Events by College ID (Students)
const getEventsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const events = await Event.findByCollegeId(collegeId);

    res.json({
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get All Events (Admin)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();

    res.json({
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get Single Event
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      message: 'Event retrieved successfully',
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Update Event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, type, date, college_id } = req.body;

    // Check if event exists
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify college exists
    const college = await College.findById(college_id);
    if (!college) {
      return res.status(400).json({ message: 'College not found' });
    }

    await Event.update(id, { title, description, type, date, college_id });

    const updatedEvent = await Event.findById(id);

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error during event update' });
  }
};

// Delete Event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.delete(id);

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error during event deletion' });
  }
};

// Get Event Statistics
const getEventStats = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const stats = await Event.getEventStats(id);

    res.json({
      message: 'Event statistics retrieved successfully',
      event,
      stats
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Server error while fetching event statistics' });
  }
};

// Validation rules
const createEventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Type is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('college_id').isInt().withMessage('Valid college ID is required')
];

const updateEventValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('type').optional().notEmpty().withMessage('Type cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('college_id').optional().isInt().withMessage('Valid college ID is required')
];

export {
  createEvent,
  getEventsByCollege,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventStats,
  createEventValidation,
  updateEventValidation
};
