import { promisePool } from '../config/db.js';

class Registration {
  static async create(registrationData) {
    const { event_id, student_id } = registrationData;
    
    // Check if already registered
    const [existing] = await promisePool.execute(
      'SELECT id FROM registrations WHERE event_id = ? AND student_id = ?',
      [event_id, student_id]
    );

    if (existing.length > 0) {
      throw new Error('Student is already registered for this event');
    }

    const [result] = await promisePool.execute(
      'INSERT INTO registrations (event_id, student_id) VALUES (?, ?)',
      [event_id, student_id]
    );
    return result.insertId;
  }

  static async findByEventId(eventId) {
    const [rows] = await promisePool.execute(
      'SELECT r.*, s.name as student_name, s.email as student_email FROM registrations r LEFT JOIN students s ON r.student_id = s.id WHERE r.event_id = ?',
      [eventId]
    );
    return rows;
  }

  static async findByStudentId(studentId) {
    const [rows] = await promisePool.execute(
      'SELECT r.*, e.title as event_title, e.date as event_date, e.type as event_type FROM registrations r LEFT JOIN events e ON r.event_id = e.id WHERE r.student_id = ? ORDER BY e.date DESC',
      [studentId]
    );
    return rows;
  }

  static async findByEventAndStudent(eventId, studentId) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM registrations WHERE event_id = ? AND student_id = ?',
      [eventId, studentId]
    );
    return rows[0];
  }

  static async delete(eventId, studentId) {
    await promisePool.execute(
      'DELETE FROM registrations WHERE event_id = ? AND student_id = ?',
      [eventId, studentId]
    );
  }

  static async getRegistrationStats() {
    const [rows] = await promisePool.execute(
      'SELECT e.id, e.title, COUNT(r.id) as registration_count FROM events e LEFT JOIN registrations r ON e.id = r.event_id GROUP BY e.id, e.title ORDER BY registration_count DESC'
    );
    return rows;
  }
}

export default Registration;
