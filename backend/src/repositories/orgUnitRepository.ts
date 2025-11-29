import { query } from '../config/database';

export type OrgUnitRow = {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
};

export class OrgUnitRepository {
  async findAll() {
    const { rows } = await query('SELECT * FROM org_units ORDER BY id ASC');
    return rows as OrgUnitRow[];
  }

  async findById(id: string) {
    const { rows } = await query('SELECT * FROM org_units WHERE id = $1 LIMIT 1', [id]);
    return rows[0] as OrgUnitRow | undefined;
  }

  async create(payload: { name: string; description?: string; parent_id?: number | null }) {
    const { rows } = await query(
      'INSERT INTO org_units (name, description, parent_id) VALUES ($1, $2, $3) RETURNING *',
      [payload.name, payload.description ?? null, payload.parent_id ?? null],
    );
    return rows[0] as OrgUnitRow;
  }

  async update(id: string, payload: Partial<{ name: string; description: string; parent_id: number | null }>) {
    const { rows } = await query(
      `UPDATE org_units SET
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        parent_id = COALESCE($4, parent_id)
       WHERE id = $1 RETURNING *`,
      [id, payload.name ?? null, payload.description ?? null, payload.parent_id ?? null],
    );
    return rows[0] as OrgUnitRow | undefined;
  }

  async delete(id: string) {
    await query('DELETE FROM org_units WHERE id = $1', [id]);
    return true;
  }
}

