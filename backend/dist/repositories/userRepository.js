"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
const mapRowToUser = (row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    passwordHash: row.password_hash,
    address: row.address,
    contactNumber: row.contact_number,
    age: row.age,
    createdAt: row.created_at,
});
class UserRepository {
    async createUser(payload) {
        const result = await (0, database_1.query)(`INSERT INTO users (full_name, email, password_hash, address, contact_number, age)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`, [
            payload.fullName,
            payload.email.toLowerCase(),
            payload.passwordHash,
            payload.address ?? null,
            payload.contactNumber ?? null,
            payload.age ?? null,
        ]);
        return mapRowToUser(result.rows[0]);
    }
    async findByEmail(email) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()]);
        return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
    }
    async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
        return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
    }
    async updateProfile(id, data) {
        const result = await (0, database_1.query)(`UPDATE users
       SET full_name = COALESCE($2, full_name),
           address = COALESCE($3, address),
           contact_number = COALESCE($4, contact_number),
           age = COALESCE($5, age)
       WHERE id = $1
       RETURNING *`, [id, data.fullName ?? null, data.address ?? null, data.contactNumber ?? null, data.age ?? null]);
        return result.rows[0] ? this.toPublic(mapRowToUser(result.rows[0])) : null;
    }
    toPublic(user) {
        const { passwordHash, ...publicUser } = user;
        return publicUser;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map