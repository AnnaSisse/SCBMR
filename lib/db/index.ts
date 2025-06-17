import { Pool } from 'pg';

// Create a connection pool
export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: false // Disable SSL for local development
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  release();
});

// Helper function to run queries
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function getRow(text: string, params?: any[]) {
  const res = await query(text, params);
  return res.rows[0];
}

// Helper function to get multiple rows
export async function getRows(text: string, params?: any[]) {
  const res = await query(text, params);
  return res.rows;
}

export default {
  query,
  getRow,
  getRows,
  pool
}; 