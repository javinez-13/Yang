-- Schema for the YangConnect Health Portal (PostgreSQL)

-- ====================
-- CORE USER ACCOUNTS
-- ====================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  contact_number VARCHAR(32),
  age SMALLINT,
  address VARCHAR(255),
  -- Restrict roles to enforce access control
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'admin', 'provider')), 
  avatar_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token UUID NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================
-- ORGANIZATIONAL CHART
-- ====================
CREATE TABLE IF NOT EXISTS org_units (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255),
  -- Self-referencing foreign key for hierarchical structure
  parent_id INTEGER REFERENCES org_units(id) ON DELETE SET NULL
);

-- ====================
-- EVENTS & SCHEDULES
-- ====================

-- Events displayed on the dashboard
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(150)
);

-- Provider availability slots (REPLACING schedule_items)
-- This tracks when a doctor/provider is generally available.
CREATE TABLE IF NOT EXISTS provider_availability (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- Restricted time slots within provider availability
-- Admin can restrict specific time slots (e.g., 8:30-10:00) even if they're within the available hours
CREATE TABLE IF NOT EXISTS restricted_time_slots (
  id SERIAL PRIMARY KEY,
  provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider_id, day_of_week, time)
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The patient
  provider_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- The doctor/provider (must have role 'provider')
  service_type VARCHAR(100) NOT NULL, -- The specific service booked (e.g., General Consultation)
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  -- Use a separate TIMESTAMPTZ for tracking the actual moment of the appointment
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes TEXT
);


INSERT INTO users (full_name, email, password_hash, contact_number, age, address, role)
VALUES
    ('John Kevin Javinez', 'javinezsarira@gmail.com', '$2a$10$1WWvXJZLs1Xoi6cUCChnPehfZNXNGYo8FnHzi/0coSEs4QYlUYUQ6', '09221546397', 26, 'Poblacion, Cordova', 'patient'),
        ('YangConnect Admin', 'admin@yangconnect.com', '$2b$10$4PoUmw6zJhNRZ9/NZlMSp.ChLSm.FrT9C1MOQBYHsID38Ps9WCRn.', '1-800-HEALTH', NULL, 'Cordova HQ', 'admin'),
    ('Dr. Maria Santos', 'maria.santos@yangconnect.com', '$2a$10$1WWvXJZLs1Xoi6cUCChnPehfZNXNGYo8FnHzi/0coSEs4QYlUYUQ6', '09170000000', 45, 'Makati Medical Center', 'provider')
ON CONFLICT (email) DO NOTHING;


-- System logs for admin auditing
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    message VARCHAR(200) NOT NULL,
    meta JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Define constants for user IDs for easier seeding
WITH user_ids AS (
    SELECT id, email FROM users
)
-- Organization Units
INSERT INTO org_units (name, description, parent_id)
VALUES
  ('YangConnect Health Portal', 'Executive Office', NULL),
  ('Chief of Medicine', 'Clinical Director', 1),
  ('Chief of Administration', 'Operations and Logistics', 1),
  ('Head of Nursing', 'Patient Care Management', 1),
  ('Department Head- Pediatrics', 'Pediatric Services', 2),
  ('Department Head- Cardiology', 'Cardiology Services', 2)
ON CONFLICT DO NOTHING;

-- Events
INSERT INTO events (title, description, event_date, location)
VALUES
  ('Wellness Fair', 'Community wellness event with free screenings', CURRENT_DATE + INTERVAL '5 days', 'Cordova Municipal Hall'),
  ('Vaccination Drive', 'Flu vaccine drive for barangay residents', CURRENT_DATE + INTERVAL '12 days', 'Barangay Poblacion')
ON CONFLICT DO NOTHING;

-- Appointments Seed Data (Matches the dates/services from the frontend design)
INSERT INTO appointments (user_id, provider_id, service_type, appointment_date, appointment_time, status, notes)
SELECT u_patient.id, u_provider.id, app_data.service, app_data.date, app_data.time, app_data.status, app_data.notes
FROM (
    VALUES 
    -- August 06: General Consultation (Confirmed)
    ('General Consultation', CURRENT_DATE + INTERVAL '10 days', '10:00:00'::TIME, 'confirmed', 'Quarterly check-up'),
    -- August 29: Teeth Cleaning (Pending)
    ('Teeth Cleaning', CURRENT_DATE + INTERVAL '33 days', '08:00:00'::TIME, 'pending', 'Standard cleaning'),
    -- September 10: Vaccination (Pending)
    ('Vaccination', CURRENT_DATE + INTERVAL '45 days', '08:00:00'::TIME, 'pending', 'COVID Booster')
) AS app_data(service, date, time, status, notes),
users AS u_patient,
users AS u_provider
WHERE u_patient.email = 'javinezsarira@gmail.com' 
AND u_provider.email = 'maria.santos@yangconnect.com'
ON CONFLICT DO NOTHING;