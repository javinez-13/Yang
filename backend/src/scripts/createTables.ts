import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required.');
  }

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        contact_number VARCHAR(32),
        age SMALLINT,
        address VARCHAR(255),
        role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'admin', 'provider')),
        avatar_url VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create password_resets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token UUID NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create org_units table
    await client.query(`
      CREATE TABLE IF NOT EXISTS org_units (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description VARCHAR(255),
        parent_id INTEGER REFERENCES org_units(id) ON DELETE SET NULL
      )
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        location VARCHAR(150)
      )
    `);

    // Create provider_availability table
    await client.query(`
      CREATE TABLE IF NOT EXISTS provider_availability (
        id SERIAL PRIMARY KEY,
        provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL
      )
    `);

    // Create appointments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        service_type VARCHAR(100) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
        notes TEXT
      )
    `);

    // Create system_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        message VARCHAR(200) NOT NULL,
        meta JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Insert default users
    await client.query(`
      INSERT INTO users (full_name, email, password_hash, contact_number, age, address, role)
      VALUES
        ('John Kevin Javinez', 'javinezsarira@gmail.com', '$2a$10$1WWvXJZLs1Xoi6cUCChnPehfZNXNGYo8FnHzi/0coSEs4QYlUYUQ6', '09221546397', 26, 'Poblacion, Cordova', 'patient'),
        ('YangConnect Admin', 'admin@yangconnect.com', '$2b$10$4PoUmw6zJhNRZ9/NZlMSp.ChLSm.FrT9C1MOQBYHsID38Ps9WCRn.', '1-800-HEALTH', NULL, 'Cordova HQ', 'admin'),
        ('Dr. Maria Santos', 'maria.santos@yangconnect.com', '$2a$10$1WWvXJZLs1Xoi6cUCChnPehfZNXNGYo8FnHzi/0coSEs4QYlUYUQ6', '09170000000', 45, 'Makati Medical Center', 'provider')
      ON CONFLICT (email) DO NOTHING
    `);

    // Insert org units
    await client.query(`
      INSERT INTO org_units (name, description, parent_id)
      VALUES
        ('YangConnect Health Portal', 'Executive Office', NULL),
        ('Chief of Medicine', 'Clinical Director', 1),
        ('Chief of Administration', 'Operations and Logistics', 1),
        ('Head of Nursing', 'Patient Care Management', 1),
        ('Department Head- Pediatrics', 'Pediatric Services', 2),
        ('Department Head- Cardiology', 'Cardiology Services', 2)
      ON CONFLICT DO NOTHING
    `);

    // Insert sample events
    await client.query(`
      INSERT INTO events (title, description, event_date, location)
      VALUES
        ('Wellness Fair', 'Community wellness event with free screenings', CURRENT_DATE + INTERVAL '5 days', 'Cordova Municipal Hall'),
        ('Vaccination Drive', 'Flu vaccine drive for barangay residents', CURRENT_DATE + INTERVAL '12 days', 'Barangay Poblacion')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ All tables created successfully!');
    console.log('✅ Default data inserted!');
  } catch (err: any) {
    console.error('Error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Failed to create tables:', error);
  process.exit(1);
});

