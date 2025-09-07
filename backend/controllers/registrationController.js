import { body, validationResult } from 'express-validator';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Register for Event (Student)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if student is from the same college as the event
    if (event.college_id !== req.user.college_id) {
      return res.status(403).json({ message: 'You can only register for events from your college' });
    }

    // Register for event
    const registrationId = await Registration.create({
      event_id: eventId,
      student_id: studentId
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      registrationId
    });
  } catch (error) {
    if (error.message === 'Student is already registered for this event') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Get Student's Registrations
const getStudentRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;

    const registrations = await Registration.findByStudentId(studentId);

    res.json({
      message: 'Registrations retrieved successfully',
      registrations
    });
  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching registrations' });
  }
};

// Get Event Registrations (Admin)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.findByEventId(eventId);

    res.json({
      message: 'Event registrations retrieved successfully',
      event,
      registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Server error while fetching event registrations' });
  }
};

// Cancel Registration (Student)
const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const studentId = req.user.id;

    // Check if registration exists
    const registration = await Registration.findByEventAndStudent(eventId, studentId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await Registration.delete(eventId, studentId);

    res.json({
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error during registration cancellation' });
  }
};

export {
  registerForEvent,
  getStudentRegistrations,
  getEventRegistrations,
  cancelRegistration
};
