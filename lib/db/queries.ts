import pool from './config';
import { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';

export async function query<T = RowDataPacket[]>(text: string, params?: unknown[]): Promise<T> {
  try {
    const [rows] = await pool.query(text, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryWithResult<T = RowDataPacket[]>(text: string, params?: unknown[]): Promise<[T, ResultSetHeader]> {
  try {
    const [rows, result] = await pool.query(text, params);
    return [rows as T, result as unknown as ResultSetHeader];
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