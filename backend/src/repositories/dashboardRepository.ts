import { query } from '../config/database';

export type DashboardStats = {
  totalUsers: number;
  averageAge: number | null;
  latestUsers: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
};

export class DashboardRepository {
  async fetchStats(): Promise<DashboardStats> {
    const [{ rows: totalRows }, { rows: averageRows }, { rows: latestRows }] = await Promise.all([
      query('SELECT COUNT(*)::int AS total FROM users'),
      query('SELECT AVG(age)::numeric(10,2) AS avg_age FROM users WHERE age IS NOT NULL'),
      query(
        `SELECT id, full_name, email
         FROM users
         ORDER BY created_at DESC
         LIMIT 4`,
      ),
    ]);

    return {
      totalUsers: totalRows[0]?.total ?? 0,
      averageAge: averageRows[0]?.avg_age ? Number(averageRows[0].avg_age) : null,
      latestUsers: latestRows.map((row: { id: string; full_name: string; email: string }) => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
      })),
    };
  }
}


