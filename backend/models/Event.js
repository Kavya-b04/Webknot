import { promisePool } from '../config/db.js';

class Event {
  static async create(eventData) {
    const { title, description, type, date, created_by, college_id } = eventData;
    const [result] = await promisePool.execute(
      'INSERT INTO events (title, description, type, date, created_by, college_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, type, date, created_by, college_id]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT e.*, a.name as created_by_name FROM events e LEFT JOIN admins a ON e.created_by = a.id WHERE e.id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByCollegeId(collegeId) {
    const [rows] = await promisePool.execute(
      'SELECT e.*, a.name as created_by_name FROM events e LEFT JOIN admins a ON e.created_by = a.id WHERE e.college_id = ? ORDER BY e.date DESC',
      [collegeId]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await promisePool.execute(
      'SELECT e.*, a.name as created_by_name, c.name as college_name FROM events e LEFT JOIN admins a ON e.created_by = a.id LEFT JOIN colleges c ON e.college_id = c.id ORDER BY e.date DESC'
    );
    return rows;
  }

  static async update(id, eventData) {
    const { title, description, type, date, college_id } = eventData;
    await promisePool.execute(
      'UPDATE events SET title = ?, description = ?, type = ?, date = ?, college_id = ? WHERE id = ?',
      [title, description, type, date, college_id, id]
    );
  }

  static async delete(id) {
    await promisePool.execute('DELETE FROM events WHERE id = ?', [id]);
  }

  static async getEventStats(eventId) {
    const [registrationCount] = await promisePool.execute(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?',
      [eventId]
    );

    const [attendanceCount] = await promisePool.execute(
      'SELECT COUNT(*) as count FROM attendance WHERE event_id = ? AND status = "present"',
      [eventId]
    );

    const [feedbackStats] = await promisePool.execute(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as feedback_count FROM feedback WHERE event_id = ?',
      [eventId]
    );

    return {
      registrationCount: registrationCount[0].count,
      attendanceCount: attendanceCount[0].count,
      avgRating: feedbackStats[0].avg_rating || 0,
      feedbackCount: feedbackStats[0].feedback_count
    };
  }
}

export default Event;
