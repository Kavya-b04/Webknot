import Registration from '../models/Registration.js';
import Attendance from '../models/Attendance.js';
import Feedback from '../models/Feedback.js';
import Event from '../models/Event.js';
import Student from '../models/Student.js';

// Get Popularity Report (total registrations per event)
const getPopularityReport = async (req, res) => {
  try {
    const stats = await Registration.getRegistrationStats();

    res.json({
      message: 'Popularity report retrieved successfully',
      report: stats
    });
  } catch (error) {
    console.error('Get popularity report error:', error);
    res.status(500).json({ message: 'Server error while fetching popularity report' });
  }
};

// Get Attendance Report for Event
const getAttendanceReport = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const stats = await Attendance.getAttendanceStats(eventId);

    res.json({
      message: 'Attendance report retrieved successfully',
      event,
      report: stats
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance report' });
  }
};

// Get Feedback Report for Event
const getFeedbackReport = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const stats = await Feedback.getFeedbackStats(eventId);

    res.json({
      message: 'Feedback report retrieved successfully',
      event,
      report: stats
    });
  } catch (error) {
    console.error('Get feedback report error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback report' });
  }
};

// Get Student Report (how many events a student attended)
const getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const stats = await Attendance.getStudentAttendanceStats(studentId);

    res.json({
      message: 'Student report retrieved successfully',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        college_id: student.college_id
      },
      report: stats
    });
  } catch (error) {
    console.error('Get student report error:', error);
    res.status(500).json({ message: 'Server error while fetching student report' });
  }
};

// Get Top Students Report (top 3 most active students)
const getTopStudentsReport = async (req, res) => {
  try {
    const topStudents = await Feedback.getTopStudents();

    res.json({
      message: 'Top students report retrieved successfully',
      report: topStudents
    });
  } catch (error) {
    console.error('Get top students report error:', error);
    res.status(500).json({ message: 'Server error while fetching top students report' });
  }
};

// Get Comprehensive Dashboard Report
const getDashboardReport = async (req, res) => {
  try {
    const collegeId = req.user.college_id;

    // Get events for the college
    const events = await Event.findByCollegeId(collegeId);
    
    // Get popularity stats
    const popularityStats = await Registration.getRegistrationStats();
    
    // Get top students
    const topStudents = await Feedback.getTopStudents();

    // Calculate overall statistics
    let totalEvents = events.length;
    let totalRegistrations = 0;
    let totalAttendance = 0;
    let totalFeedback = 0;
    let avgRating = 0;

    for (const event of events) {
      const eventStats = await Event.getEventStats(event.id);
      totalRegistrations += eventStats.registrationCount;
      totalAttendance += eventStats.attendanceCount;
      totalFeedback += eventStats.feedbackCount;
      avgRating += eventStats.avgRating;
    }

    avgRating = totalEvents > 0 ? avgRating / totalEvents : 0;

    res.json({
      message: 'Dashboard report retrieved successfully',
      report: {
        collegeId,
        totalEvents,
        totalRegistrations,
        totalAttendance,
        totalFeedback,
        avgRating: Math.round(avgRating * 100) / 100,
        events: events.slice(0, 5), // Latest 5 events
        topStudents: topStudents.slice(0, 3) // Top 3 students
      }
    });
  } catch (error) {
    console.error('Get dashboard report error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard report' });
  }
};

export {
  getPopularityReport,
  getAttendanceReport,
  getFeedbackReport,
  getStudentReport,
  getTopStudentsReport,
  getDashboardReport
};
