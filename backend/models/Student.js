import { promisePool } from '../config/db.js';
import bcrypt from 'bcryptjs';

class Student {
  static async create(studentData) {
    const { name, email, password, college_id } = studentData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await promisePool.execute(
      'INSERT INTO students (name, email, password, college_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, college_id]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT id, name, email, college_id FROM students WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default Student;