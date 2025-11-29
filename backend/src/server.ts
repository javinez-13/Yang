import app from './app';
import { env } from './config/env';
import { pool } from './config/database';
import { ensureDefaultAdmin } from './scripts/ensureAdmin';

const start = async () => {
  try {
    const client = await pool.connect();
    client.release();
    // Create default admin user for development environments if none exists
    if (process.env.NODE_ENV !== 'production') {
      try {
        await ensureDefaultAdmin();
      } catch (err) {
        console.error('Failed to ensure default admin:', err);
        // Continue with server startup even if we couldn't create the admin
      }
    }
    app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();

