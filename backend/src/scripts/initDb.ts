import { readFileSync } from 'fs';
import path from 'path';
import { Client } from 'pg';

const run = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed the database.');
  }

  const sqlPath = path.resolve(__dirname, '../db/init.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  await client.query(sql);
  await client.end();

  console.log('Database schema applied successfully.');
};

run().catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});


