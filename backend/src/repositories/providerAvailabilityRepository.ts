import { query } from '../config/database';

export type ProviderAvailabilityRow = {
  id: number;
  provider_id: string | number;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

export class ProviderAvailabilityRepository {
  async findAll() {
    const { rows } = await query('SELECT * FROM provider_availability ORDER BY provider_id, day_of_week, start_time');
    return rows as ProviderAvailabilityRow[];
  }

  async findById(id: string) {
    const { rows } = await query('SELECT * FROM provider_availability WHERE id = $1 LIMIT 1', [id]);
    return rows[0] as ProviderAvailabilityRow | undefined;
  }

  async findByProvider(providerId: string) {
    const { rows } = await query('SELECT * FROM provider_availability WHERE provider_id = $1 ORDER BY day_of_week, start_time', [providerId]);
    return rows as ProviderAvailabilityRow[];
  }

  async create(payload: { provider_id: string | number; day_of_week: number; start_time: string; end_time: string }) {
    const { rows } = await query(
      'INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [payload.provider_id, payload.day_of_week, payload.start_time, payload.end_time],
    );
    return rows[0] as ProviderAvailabilityRow;
  }

  async update(id: string, payload: Partial<{ provider_id: string | number; day_of_week: number; start_time: string; end_time: string }>) {
    const { rows } = await query(
      `UPDATE provider_availability SET
        provider_id = COALESCE($2, provider_id),
        day_of_week = COALESCE($3, day_of_week),
        start_time = COALESCE($4, start_time),
        end_time = COALESCE($5, end_time)
       WHERE id = $1 RETURNING *`,
      [id, payload.provider_id ?? null, payload.day_of_week ?? null, payload.start_time ?? null, payload.end_time ?? null],
    );
    return rows[0] as ProviderAvailabilityRow | undefined;
  }

  async delete(id: string) {
    await query('DELETE FROM provider_availability WHERE id = $1', [id]);
    return true;
  }
}

