import app from './app';
import { env } from './config/env';
import { pool } from './config/database';

const start = async () => {
  try {
    const client = await pool.connect();
    client.release();
    app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();

