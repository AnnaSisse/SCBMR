import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db/queries';

export async function GET() {
  try {
    const result = await testConnection();
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result.now 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 