import { query } from '../config/database';

export class AppointmentRepository {
  async fetchAll() {
    const { rows } = await query(
      `SELECT a.*, p.full_name as patient_name, d.full_name as provider_name
       FROM appointments a
       JOIN users p ON p.id = a.user_id
       JOIN users d ON d.id = a.provider_id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    );
    return rows;
  }

  async fetchByUserId(userId: string) {
    const { rows } = await query(
      `SELECT a.*, p.full_name as patient_name, d.full_name as provider_name
       FROM appointments a
       JOIN users p ON p.id = a.user_id
       JOIN users d ON d.id = a.provider_id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [userId]
    );
    return rows;
  }

  async create(payload: { user_id: string | number; provider_id: string | number; service_type: string; appointment_date: string; appointment_time: string; notes?: string }) {
    const { rows } = await query(
      `INSERT INTO appointments (user_id, provider_id, service_type, appointment_date, appointment_time, status, notes)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING *`,
      [payload.user_id, payload.provider_id, payload.service_type, payload.appointment_date, payload.appointment_time, payload.notes ?? null]
    );
    return rows[0];
  }

  async updateStatus(id: string, status: string) {
    const { rows } = await query('UPDATE appointments SET status = $2 WHERE id = $1 RETURNING *', [id, status]);
    return rows[0];
  }
}
