import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        host: process.env.MYSQL_HOST || 'not-set',
        database: process.env.MYSQL_DATABASE || 'not-set',
        port: process.env.MYSQL_PORT || 'not-set',
        hasPassword: !!process.env.MYSQL_PASSWORD,
      },
      secrets: {
        hasAesKey: !!process.env.AES_SECRET_KEY,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 