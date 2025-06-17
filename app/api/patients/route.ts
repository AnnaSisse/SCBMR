import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/patients - Get all patients with optional filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const offset = (page - 1) * limit;

        let queryText = `
            SELECT * FROM patients 
            WHERE first_name ILIKE $1 
            OR last_name ILIKE $1 
            OR email ILIKE $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `;
        
        const result = await query(queryText, [`%${search}%`, limit, offset]);
        
        // Get total count for pagination
        const countResult = await query(
            'SELECT COUNT(*) FROM patients WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1',
            [`%${search}%`]
        );
        
        return NextResponse.json({
            success: true,
            data: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].count),
                page,
                limit,
                totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch patients',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/patients - Create a new patient
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'date_of_birth'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO patients 
            (first_name, last_name, date_of_birth, gender, phone_number, email, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                body.first_name,
                body.last_name,
                body.date_of_birth,
                body.gender,
                body.phone_number,
                body.email,
                body.address
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Patient created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create patient',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 