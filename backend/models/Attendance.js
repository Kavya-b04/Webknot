import { promisePool } from '../config/db.js';

class Attendance {
  static async create(attendanceData) {
    const { event_id, student_id, status } = attendanceData;
    
    // Check if attendance already marked
    const [existing] = await promisePool.execute(
      'SELECT id FROM attendance WHERE event_id = ? AND student_id = ?',
      [event_id, student_id]
    );

    if (existing.length > 0) {
      // Update existing attendance
      await promisePool.execute(
        'UPDATE attendance SET status = ? WHERE event_id = ? AND student_id = ?',
        [status, event_id, student_id]
      );
      return existing[0].id;
    } else {
      // Create new attendance record
      const [result] = await promisePool.execute(
        'INSERT INTO attendance (event_id, student_id, status) VALUES (?, ?, ?)',
        [event_id, student_id, status]
      );
      return result.insertId;
    }
  }

  static async findByEventId(eventId) {
    const [rows] = await promisePool.execute(
      'SELECT a.*, s.name as student_name, s.email as student_email FROM attendance a LEFT JOIN students s ON a.student_id = s.id WHERE a.event_id = ?',
      [eventId]
    );
    return rows;
  }

  static async findByStudentId(studentId) {
    const [rows] = await promisePool.execute(
      'SELECT a.*, e.title as event_title, e.date as event_date FROM attendance a LEFT JOIN events e ON a.event_id = e.id WHERE a.student_id = ? ORDER BY e.date DESC',
      [studentId]
    );
    return rows;
  }

  static async getAttendanceStats(eventId) {
    const [total] = await promisePool.execute(
      'SELECT COUNT(*) as total FROM registrations WHERE event_id = ?',
      [eventId]
    );

    const [present] = await promisePool.execute(
      'SELECT COUNT(*) as present FROM attendance WHERE event_id = ? AND status = "present"',
      [eventId]
    );

    const [absent] = await promisePool.execute(
      'SELECT COUNT(*) as absent FROM attendance WHERE event_id = ? AND status = "absent"',
      [eventId]
    );

    const totalRegistrations = total[0].total;
    const presentCount = present[0].present;
    const absentCount = absent[0].absent;
    const attendancePercentage = totalRegistrations > 0 ? (presentCount / totalRegistrations) * 100 : 0;

    return {
      totalRegistrations,
      presentCount,
      absentCount,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100
    };
  }

  static async getStudentAttendanceStats(studentId) {
    const [total] = await promisePool.execute(
      'SELECT COUNT(*) as total FROM registrations WHERE student_id = ?',
      [studentId]
    );

    const [attended] = await promisePool.execute(
      'SELECT COUNT(*) as attended FROM attendance WHERE student_id = ? AND status = "present"',
      [studentId]
    );

    return {
      totalEvents: total[0].total,
      attendedEvents: attended[0].attended
    };
  }
}

export default Attendance;
