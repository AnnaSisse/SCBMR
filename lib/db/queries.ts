import pool from './config';

export async function query(text: string, params?: any[]) {
  try {
    const [rows] = await pool.query(text, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Example query function
export async function testConnection() {
  try {
    const result = await query('SELECT NOW() as now');
    return result[0];
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
} 