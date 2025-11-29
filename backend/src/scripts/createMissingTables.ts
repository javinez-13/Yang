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
    // Check if users table exists and get its id type
    const usersCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id'
    `);

    let userIdType = 'INTEGER';
    if (usersCheck.rows.length > 0) {
      userIdType = usersCheck.rows[0].data_type === 'uuid' ? 'UUID' : 'INTEGER';
      console.log(`Users table exists with id type: ${userIdType}`);
    }

    // Create org_units table (doesn't depend on users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS org_units (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description VARCHAR(255),
        parent_id INTEGER REFERENCES org_units(id) ON DELETE SET NULL)
    `);
    console.log('✅ org_units table created/verified');

    // Create events table (doesn't depend on users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        location VARCHAR(150))
    `);
    console.log('✅ events table created/verified');

    // Create provider_availability table (depends on users)
    if (userIdType === 'UUID') {
      await client.query(`
        CREATE TABLE IF NOT EXISTS provider_availability (
          id SERIAL PRIMARY KEY,
          provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
          start_time TIME NOT NULL,
          end_time TIME NOT NULL)
      `);
    } else {
      await client.query(`
        CREATE TABLE IF NOT EXISTS provider_availability (
          id SERIAL PRIMARY KEY,
          provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
          start_time TIME NOT NULL,
          end_time TIME NOT NULL)
      `);
    }
    console.log('✅ provider_availability table created/verified');

    // Create appointments table (depends on users)
    if (userIdType === 'UUID') {
      await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          service_type VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
          notes TEXT)
      `);
    } else {
      await client.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          service_type VARCHAR(100) NOT NULL,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
          notes TEXT)
      `);
    }
    console.log('✅ appointments table created/verified');

    // Create system_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        message VARCHAR(200) NOT NULL,
        meta JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())
    `);
    console.log('✅ system_logs table created/verified');

    // Insert sample data (only if tables are empty)
    const orgCount = await client.query('SELECT COUNT(*) FROM org_units');
    if (parseInt(orgCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO org_units (name, description, parent_id)
        VALUES
          ('YangConnect Health Portal', 'Executive Office', NULL),
          ('Chief of Medicine', 'Clinical Director', 1),
          ('Chief of Administration', 'Operations and Logistics', 1),
          ('Head of Nursing', 'Patient Care Management', 1),
          ('Department Head- Pediatrics', 'Pediatric Services', 2),
          ('Department Head- Cardiology', 'Cardiology Services', 2)
      `);
      console.log('✅ Sample org_units inserted');
    }

    const eventsCount = await client.query('SELECT COUNT(*) FROM events');
    if (parseInt(eventsCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO events (title, description, event_date, location)
        VALUES
          ('Wellness Fair', 'Community wellness event with free screenings', CURRENT_DATE + INTERVAL '5 days', 'Cordova Municipal Hall'),
          ('Vaccination Drive', 'Flu vaccine drive for barangay residents', CURRENT_DATE + INTERVAL '12 days', 'Barangay Poblacion')
      `);
      console.log('✅ Sample events inserted');
    }

    console.log('\n🎉 All tables created/verified successfully!');
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

