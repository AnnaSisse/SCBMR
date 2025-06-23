import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';
import { query } from '@/lib/db/queries';

export async function GET() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Test query
    const result = await query('SELECT * FROM test_table');
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 