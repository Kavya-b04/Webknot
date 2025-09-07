import { promisePool } from '../config/db.js';

class Feedback {
  static async create(feedbackData) {
    const { event_id, student_id, rating, comments } = feedbackData;
    
    // Check if feedback already exists
    const [existing] = await promisePool.execute(
      'SELECT id FROM feedback WHERE event_id = ? AND student_id = ?',
      [event_id, student_id]
    );

    if (existing.length > 0) {
      // Update existing feedback
      await promisePool.execute(
        'UPDATE feedback SET rating = ?, comments = ? WHERE event_id = ? AND student_id = ?',
        [rating, comments, event_id, student_id]
      );
      return existing[0].id;
    } else {
      // Create new feedback record
      const [result] = await promisePool.execute(
        'INSERT INTO feedback (event_id, student_id, rating, comments) VALUES (?, ?, ?, ?)',
        [event_id, student_id, rating, comments]
      );
      return result.insertId;
    }
  }

  static async findByEventId(eventId) {
    const [rows] = await promisePool.execute(
      'SELECT f.*, s.name as student_name FROM feedback f LEFT JOIN students s ON f.student_id = s.id WHERE f.event_id = ? ORDER BY f.created_at DESC',
      [eventId]
    );
    return rows;
  }

  static async findByStudentId(studentId) {
    const [rows] = await promisePool.execute(
      'SELECT f.*, e.title as event_title, e.date as event_date FROM feedback f LEFT JOIN events e ON f.event_id = e.id WHERE f.student_id = ? ORDER BY f.created_at DESC',
      [studentId]
    );
    return rows;
  }

  static async getFeedbackStats(eventId) {
    const [stats] = await promisePool.execute(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as total_feedback, MIN(rating) as min_rating, MAX(rating) as max_rating FROM feedback WHERE event_id = ?',
      [eventId]
    );

    const [ratingDistribution] = await promisePool.execute(
      'SELECT rating, COUNT(*) as count FROM feedback WHERE event_id = ? GROUP BY rating ORDER BY rating',
      [eventId]
    );

    return {
      avgRating: stats[0].avg_rating ? Math.round(stats[0].avg_rating * 100) / 100 : 0,
      totalFeedback: stats[0].total_feedback,
      minRating: stats[0].min_rating || 0,
      maxRating: stats[0].max_rating || 0,
      ratingDistribution
    };
  }

  static async getTopStudents() {
    const [rows] = await promisePool.execute(
      'SELECT s.id, s.name, s.email, COUNT(f.id) as feedback_count, AVG(f.rating) as avg_rating FROM students s LEFT JOIN feedback f ON s.id = f.student_id GROUP BY s.id, s.name, s.email ORDER BY feedback_count DESC, avg_rating DESC LIMIT 3'
    );
    return rows;
  }
}

export default Feedback;
