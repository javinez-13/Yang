import { query } from '../config/database';

export type EventRow = {
  id: number;
  title: string;
  description: string | null;
  event_date: Date;
  location: string | null;
};

export class EventRepository {
  async findAll() {
    const { rows } = await query('SELECT * FROM events ORDER BY event_date ASC');
    return rows as EventRow[];
  }

  async findById(id: string) {
    const { rows } = await query('SELECT * FROM events WHERE id = $1 LIMIT 1', [id]);
    return rows[0] as EventRow | undefined;
  }

  async create(payload: { title: string; description?: string; event_date: string; location?: string }) {
    const { rows } = await query(
      'INSERT INTO events (title, description, event_date, location) VALUES ($1,$2,$3,$4) RETURNING *',
      [payload.title, payload.description ?? null, payload.event_date, payload.location ?? null],
    );
    return rows[0] as EventRow;
  }

  async update(id: string, payload: Partial<{ title: string; description: string; event_date: string; location: string }>) {
    const { rows } = await query(
      `UPDATE events SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        event_date = COALESCE($4, event_date),
        location = COALESCE($5, location)
       WHERE id = $1 RETURNING *`,
      [id, payload.title ?? null, payload.description ?? null, payload.event_date ?? null, payload.location ?? null],
    );
    return rows[0] as EventRow | undefined;
  }

  async delete(id: string) {
    await query('DELETE FROM events WHERE id = $1', [id]);
    return true;
  }
}
