// scripts/db-test.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // <-- load your .env.local

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
  keepAlive: true,
});

(async () => {
  try {
    const r = await pool.query('select now() as ts, current_user as "user", version() as v');
    console.log('DB OK:', r.rows[0]);
  } catch (e) {
    console.error('DB TEST FAILED:', e);
  } finally {
    await pool.end();
  }
})();
