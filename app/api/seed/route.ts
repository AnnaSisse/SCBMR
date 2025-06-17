import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
    try {
        const seededData = await seedDatabase();
        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            data: seededData
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to seed database',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 