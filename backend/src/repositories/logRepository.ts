import { query } from '../config/database';

export class LogRepository {
  async fetchAll(limit = 200) {
    const { rows } = await query('SELECT * FROM system_logs ORDER BY created_at DESC LIMIT $1', [limit]);
    return rows;
  }

  async create(message: string, meta?: any) {
    await query('INSERT INTO system_logs (message, meta) VALUES ($1, $2)', [message, meta ? JSON.stringify(meta) : null]);
  }
}
