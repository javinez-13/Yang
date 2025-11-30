import { query } from '../config/database';

export type RestrictedSlotRow = {
  id: number;
  provider_id: number;
  day_of_week: number;
  time: string;
  created_at: Date;
};

export class RestrictedSlotRepository {
  async findAll() {
    const { rows } = await query(
      'SELECT * FROM restricted_time_slots ORDER BY provider_id, day_of_week, time'
    );
    return rows as RestrictedSlotRow[];
  }

  async findByProvider(providerId: string | number) {
    const { rows } = await query(
      'SELECT * FROM restricted_time_slots WHERE provider_id = $1 ORDER BY day_of_week, time',
      [providerId]
    );
    return rows as RestrictedSlotRow[];
  }

  async findByProviderAndDay(providerId: string | number, dayOfWeek: number) {
    const { rows } = await query(
      'SELECT * FROM restricted_time_slots WHERE provider_id = $1 AND day_of_week = $2 ORDER BY time',
      [providerId, dayOfWeek]
    );
    return rows as RestrictedSlotRow[];
  }

  async findOne(providerId: string | number, dayOfWeek: number, time: string) {
    const { rows } = await query(
      'SELECT * FROM restricted_time_slots WHERE provider_id = $1 AND day_of_week = $2 AND time = $3 LIMIT 1',
      [providerId, dayOfWeek, time]
    );
    return rows[0] as RestrictedSlotRow | undefined;
  }

  async create(payload: { provider_id: string | number; day_of_week: number; time: string }) {
    const { rows } = await query(
      'INSERT INTO restricted_time_slots (provider_id, day_of_week, time) VALUES ($1, $2, $3) RETURNING *',
      [payload.provider_id, payload.day_of_week, payload.time]
    );
    return rows[0] as RestrictedSlotRow;
  }

  async delete(providerId: string | number, dayOfWeek: number, time: string) {
    await query(
      'DELETE FROM restricted_time_slots WHERE provider_id = $1 AND day_of_week = $2 AND time = $3',
      [providerId, dayOfWeek, time]
    );
    return true;
  }

  async deleteByProvider(providerId: string | number) {
    await query('DELETE FROM restricted_time_slots WHERE provider_id = $1', [providerId]);
    return true;
  }
}
