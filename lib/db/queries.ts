import pool from './config';
import { RowDataPacket } from 'mysql2';

export async function query<T extends RowDataPacket = RowDataPacket[]>(text: string, params?: unknown[]): Promise<T> {
  try {
    const [rows] = await pool.query(text, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Example query function
export async function testConnection(): Promise<RowDataPacket> {
  try {
    const result = await query<RowDataPacket[]>('SELECT NOW() as now');
    return result[0];
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
} 