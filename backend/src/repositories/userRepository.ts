import { query } from '../config/database';
import { CreateUserInput, PublicUser, User } from '../types/user';

const mapRowToUser = (row: {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string | null;
  address: string | null;
  contact_number: string | null;
  age: number | null;
  created_at: Date;
}): User => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role ?? 'patient',
  address: row.address,
  contactNumber: row.contact_number,
  age: row.age,
  createdAt: row.created_at,
});

export class UserRepository {
  async createUser(payload: CreateUserInput & { passwordHash: string }): Promise<User> {
    try {
      const result = await query(
        `INSERT INTO users (full_name, email, password_hash, role, address, contact_number, age)
         VALUES ($1, $2, $3, COALESCE($4, 'patient'), $5, $6, $7)
         RETURNING *`,
        [
          payload.fullName,
          payload.email.toLowerCase(),
          payload.passwordHash,
          payload.role ?? null,
          payload.address ?? null,
          payload.contactNumber ?? null,
          payload.age ?? null,
        ],
      );

      return mapRowToUser(result.rows[0]);
    } catch (err: any) {
      // Fallback for older schemas without role column: retry without role
      const fallbackMessage = String(err?.message ?? '').toLowerCase();
      // Match older postgres message formats like `column "role" does not exist` or
      // `column "role" of relation "users" does not exist` by checking presence of `column "role"`.
      if (fallbackMessage.includes('column \"role\"') && payload.role) {
        const result = await query(
          `INSERT INTO users (full_name, email, password_hash, address, contact_number, age)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [payload.fullName, payload.email.toLowerCase(), payload.passwordHash, payload.address ?? null, payload.contactNumber ?? null, payload.age ?? null],
        );
        return mapRowToUser(result.rows[0]);
      }
      throw err;
    }

    // Note: We already return inside try/catch branches. This is unreachable but kept for parity.
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email.toLowerCase()]);
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
  }

  async countByRole(role: string): Promise<number> {
    try {
      const result = await query('SELECT COUNT(*) FROM users WHERE role = $1', [role]);
      return Number(result.rows[0]?.count ?? 0);
    } catch (err: any) {
      // If the schema is old and 'role' doesn't exist, fall back to 0 (no admin)
      const message = String(err?.message ?? '').toLowerCase();
      if (message.includes('column \"role\"')) {
        return 0;
      }
      throw err;
    }
  }

  async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null;
  }

  async updateProfile(
    id: string,
    data: Partial<Pick<CreateUserInput, 'fullName' | 'address' | 'contactNumber' | 'age'>>,
  ): Promise<PublicUser | null> {
    const result = await query(
      `UPDATE users
       SET full_name = COALESCE($2, full_name),
           address = COALESCE($3, address),
           contact_number = COALESCE($4, contact_number),
           age = COALESCE($5, age)
       WHERE id = $1
       RETURNING *`,
      [id, data.fullName ?? null, data.address ?? null, data.contactNumber ?? null, data.age ?? null],
    );

    return result.rows[0] ? this.toPublic(mapRowToUser(result.rows[0])) : null;
  }

  toPublic(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}

