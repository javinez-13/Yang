import { readFileSync } from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to seed the database.');
  }

  const sqlPath = path.resolve(__dirname, '../../db/init.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const client = await pool.connect();
  
  try {
    // Execute the entire SQL file
    await client.query(sql);
    console.log('Database schema applied successfully.');
  } catch (err: any) {
    // If it's a syntax error, try executing statements one by one
    if (err.code === '42601') {
      console.log('Trying alternative execution method...');
      const statements = sql
        .split(/;\s*(?=\n|$)/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\s*$/));
      
      for (const statement of statements) {
        if (statement.trim() && !statement.trim().startsWith('--')) {
          try {
            await client.query(statement);
          } catch (stmtErr: any) {
            // Ignore errors for IF NOT EXISTS or ON CONFLICT
            if (!stmtErr.message.includes('already exists') && 
                !stmtErr.message.includes('duplicate key') &&
                !stmtErr.message.includes('ON CONFLICT')) {
              console.warn('Warning executing statement:', stmtErr.message);
            }
          }
        }
      }
      console.log('Database schema applied successfully (with warnings).');
    } else {
      throw err;
    }
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});


