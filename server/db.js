import {Pool} from 'pg';

import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
    // Prefer a single DATABASE_URL (connection string) if provided (e.g. Neon DB).
    // Falls back to individual env vars for host/user/password/database/port.
    // Allow either DATABASE_URL (12-factor) or DB_URL (existing) as the connection string.
    ...(process.env.DATABASE_URL || process.env.DB_URL
        ? {
              connectionString: process.env.DATABASE_URL || process.env.DB_URL,
              // Neon and many managed Postgres providers require SSL.
              // Setting rejectUnauthorized to false is common when the server
              // provides a valid cert chain not verifiable against local CAs.
              ssl: { rejectUnauthorized: false },
          }
        : {
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASS,
              database: process.env.DB_NAME,
              port: process.env.DB_PORT,
          }),
}); 
