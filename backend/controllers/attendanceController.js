import { body, validationResult } from 'express-validator';
import Attendance from '../models/Attendance.js';
import Event from '../models/Event.js';
import Student from '../models/Student.js';

// Mark Attendance (Admin)
const markAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, studentId } = req.params;
    const { status } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student is from the same college as the event
    if (event.college_id !== student.college_id) {
      return res.status(400).json({ message: 'Student is not from the same college as the event' });
    }

    const attendanceId = await Attendance.create({
      event_id: eventId,
      student_id: studentId,
      status
    });

    res.json({
      message: 'Attendance marked successfully',
      attendanceId
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error during attendance marking' });
  }
};

// Get Event Attendance (Admin)
const getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendance = await Attendance.findByEventId(eventId);
    const stats = await Attendance.getAttendanceStats(eventId);

    res.json({
      message: 'Event attendance retrieved successfully',
      event,
      attendance,
      stats
    });
  } catch (error) {
    console.error('Get event attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching event attendance' });
  }
};

// Get Student Attendance
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendance = await Attendance.findByStudentId(studentId);
    const stats = await Attendance.getStudentAttendanceStats(studentId);

    res.json({
      message: 'Student attendance retrieved successfully',
      attendance,
      stats
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching student attendance' });
  }
};

// Get Attendance Statistics for Event
const getAttendanceStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const stats = await Attendance.getAttendanceStats(eventId);

    res.json({
      message: 'Attendance statistics retrieved successfully',
      event,
      stats
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance statistics' });
  }
};

// Validation rules
const markAttendanceValidation = [
  body('status').isIn(['present', 'absent']).withMessage('Status must be either "present" or "absent"')
];

export {
  markAttendance,
  getEventAttendance,
  getStudentAttendance,
  getAttendanceStats,
  markAttendanceValidation
};
