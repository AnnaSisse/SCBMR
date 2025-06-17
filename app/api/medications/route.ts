import { NextResponse } from 'next/server';
import { createMedication, addPrescriptionMedication } from '@/lib/db/medical_queries';
import { withValidation } from '@/lib/middleware/validation';
import { query } from '@/lib/db/queries';

// GET /api/medications - List all medications
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'name';
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        const offset = (page - 1) * limit;

        // Build the WHERE clause based on filters
        let conditions = [];
        const queryParams: any[] = [];
        let paramCount = 1;

        if (search) {
            conditions.push(`(LOWER(m.name) LIKE LOWER($${paramCount}) OR LOWER(m.description) LIKE LOWER($${paramCount}))`);
            queryParams.push(`%${search}%`);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countQuery = `
            SELECT COUNT(*) 
            FROM medications m
            ${whereClause}
        `;
        const countResult = await query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].count);

        // Get medications with prescription counts
        const result = await query(
            `SELECT m.*, 
                    COUNT(pm.prescription_id) as prescription_count,
                    json_agg(DISTINCT jsonb_build_object(
                        'prescription_id', pm.prescription_id,
                        'dosage', pm.dosage,
                        'frequency', pm.frequency,
                        'duration', pm.duration,
                        'created_at', pm.created_at
                    )) FILTER (WHERE pm.prescription_id IS NOT NULL) as prescriptions
            FROM medications m
            LEFT JOIN prescription_medications pm ON m.medication_id = pm.medication_id
            ${whereClause}
            GROUP BY m.medication_id
            ORDER BY m.${sortBy} ${sortOrder}
            LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            [...queryParams, limit, offset]
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching medications:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch medications',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/medications - Create a new medication
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['name'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Check for duplicate medication name
        const existingMed = await query(
            'SELECT * FROM medications WHERE LOWER(name) = LOWER($1)',
            [body.name]
        );

        if (existingMed.rows.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'A medication with this name already exists'
            }, { status: 409 });
        }

        const result = await query(
            `INSERT INTO medications (
                name,
                description,
                dosage
            ) VALUES ($1, $2, $3)
            RETURNING *`,
            [
                body.name,
                body.description,
                body.dosage
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Medication created successfully',
            data: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating medication:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/medications/prescribe - Add medication to a prescription
export async function prescribe(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.record_id || !body.medication_id || !body.dosage || !body.frequency || !body.duration) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: record_id, medication_id, dosage, frequency, and duration are required'
            }, { status: 400 });
        }

        const prescription = await addPrescriptionMedication({
            record_id: body.record_id,
            medication_id: body.medication_id,
            dosage: body.dosage,
            frequency: body.frequency,
            duration: body.duration
        });

        return NextResponse.json({
            success: true,
            message: 'Medication added to prescription successfully',
            data: prescription
        });
    } catch (error) {
        console.error('Error adding medication to prescription:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to add medication to prescription',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 