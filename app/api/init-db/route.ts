import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Read the comprehensive reset schema file
        const schemaPath = path.join(process.cwd(), 'lib/db/reset_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the reset schema
        await query(schema);

        return NextResponse.json({
            success: true,
            message: 'Medical database schema initialized successfully'
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to initialize database schema',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 