// @ts-ignore
import { promisePool } from '../config/db.js';

class College {
  static async create(collegeData) {
    const { name, location } = collegeData;
    const [result] = await promisePool.execute(
      'INSERT INTO colleges (name, location) VALUES (?, ?)',
      [name, location]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await promisePool.execute(
      'SELECT * FROM colleges WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await promisePool.execute('SELECT * FROM colleges');
    return rows;
  }
}

export default College;