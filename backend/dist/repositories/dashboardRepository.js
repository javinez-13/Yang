"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const database_1 = require("../config/database");
class DashboardRepository {
    async fetchStats() {
        const [{ rows: totalRows }, { rows: averageRows }, { rows: latestRows }] = await Promise.all([
            (0, database_1.query)('SELECT COUNT(*)::int AS total FROM users'),
            (0, database_1.query)('SELECT AVG(age)::numeric(10,2) AS avg_age FROM users WHERE age IS NOT NULL'),
            (0, database_1.query)(`SELECT id, full_name, email
         FROM users
         ORDER BY created_at DESC
         LIMIT 4`),
        ]);
        return {
            totalUsers: totalRows[0]?.total ?? 0,
            averageAge: averageRows[0]?.avg_age ? Number(averageRows[0].avg_age) : null,
            latestUsers: latestRows.map((row) => ({
                id: row.id,
                fullName: row.full_name,
                email: row.email,
            })),
        };
    }
}
exports.DashboardRepository = DashboardRepository;
//# sourceMappingURL=dashboardRepository.js.map