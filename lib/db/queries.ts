import pool from './config';

export async function query(text: string, params?: any[]) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Example query function
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    return result.rows[0];
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
} 