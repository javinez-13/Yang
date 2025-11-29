import { query } from '../config/database';
import { UserRepository } from '../repositories/userRepository';
import { hashPassword } from '../utils/password';

const DEFAULT_ADMIN = {
  fullName: 'YangConnect Admin',
  email: 'admin@yangconnect.com',
  password: 'admin1234',
  address: 'Cordova HQ',
  contactNumber: '1-800-HEALTH',
  role: 'admin',
};

export const ensureDefaultAdmin = async () => {
  const repo = new UserRepository();

  // 1. Check if 'role' column exists in users table; add if missing
  const roleColumn = await query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role' LIMIT 1`,
  );

  if (!roleColumn.rows.length) {
    try {
      console.warn('Role column not found in users table. Adding role column (non-destructive).');
      await query(
        "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'patient';",
      );
      await query(
        "ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('patient','admin','provider'));",
      );
    } catch (err) {
      console.warn('Failed to add role column or constraint; continuing if role cannot be enforced.', err);
    }
  }

  // 2. If there is already an admin user, nothing to do
  const existing = await repo.countByRole('admin');
  if (existing > 0) {
    console.log('Admin account already exists; skipping creation');
    return;
  }

  // 3. If a user exists with admin email, update role to admin; else create it
  const { rows: foundByEmail } = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [DEFAULT_ADMIN.email.toLowerCase()]);
  const passwordHash = await hashPassword(DEFAULT_ADMIN.password);

  if (foundByEmail.length) {
    try {
      await query('UPDATE users SET role = $1 WHERE id = $2', ['admin', foundByEmail[0].id]);
      console.log('Set role to admin for existing user:', DEFAULT_ADMIN.email);
      return;
    } catch (err) {
      console.warn('Unable to update existing user to admin; attempting to create admin user instead', err);
    }
  }

  // No existing user; create a new admin
  try {
    await repo.createUser({
      fullName: DEFAULT_ADMIN.fullName,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      address: DEFAULT_ADMIN.address,
      contactNumber: DEFAULT_ADMIN.contactNumber,
      role: DEFAULT_ADMIN.role,
    } as any);
    console.log('Default admin user created:', DEFAULT_ADMIN.email);
  } catch (err) {
    console.warn('Failed to create default admin directly via repo; attempting an explicit insert', err);
    try {
      await query('INSERT INTO users (full_name, email, password_hash, role, address, contact_number) VALUES ($1,$2,$3,$4,$5,$6)', [DEFAULT_ADMIN.fullName, DEFAULT_ADMIN.email.toLowerCase(), passwordHash, 'admin', DEFAULT_ADMIN.address, DEFAULT_ADMIN.contactNumber]);
      console.log('Default admin user created via SQL insert:', DEFAULT_ADMIN.email);
    } catch (err2) {
      console.error('Failed to ensure default admin user:', err2);
    }
  }
};

export default ensureDefaultAdmin;
