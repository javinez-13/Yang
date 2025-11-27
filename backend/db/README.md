# Neon Database Setup

1. Provision the Neon instance and copy the pooled connection string.
2. Export the URL locally (or add it to `backend/.env`):
   ```bash
   DATABASE_URL="postgresql://neondb_owner:npg_Me2DkZxiVKX3@ep-holy-feather-a18e0pne-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```
3. Bootstrap the schema:
   ```bash
   psql "$DATABASE_URL" -f backend/db/init.sql
   ```
4. Start the API after the migration completes:
   ```bash
   cd backend && npm run dev
   ```

The `init.sql` script provisions the `users` table and UUID helpers required by the authentication, profile, and dashboard features.


