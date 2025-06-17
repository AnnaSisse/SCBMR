import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';
import { withValidation } from '@/lib/middleware/validation';

// GET /api/prescriptions - Get all prescriptions with filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const patientId = searchParams.get('patient_id');
        const doctorId = searchParams.get('doctor_id');
        const status = searchParams.get('status');
        const offset = (page - 1) * limit;

        // Build the base query conditions
        let conditions = [];
        const queryParams: any[] = [];
        let paramCount = 1;

        if (patientId) {
            conditions.push(`mr.patient_id = $${paramCount}`);
            queryParams.push(patientId);
            paramCount++;
        }

        if (doctorId) {
            conditions.push(`mr.doctor_id = $${paramCount}`);
            queryParams.push(doctorId);
            paramCount++;
        }

        if (status) {
            conditions.push(`pm.status = $${paramCount}`);
            queryParams.push(status);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Main query
        const queryText = `
            SELECT pm.*, 
                   m.name as medication_name,
                   m.description as medication_description,
                   p.first_name as patient_first_name, 
                   p.last_name as patient_last_name,
                   d.first_name as doctor_first_name, 
                   d.last_name as doctor_last_name
            FROM prescription_medications pm
            JOIN medications m ON pm.medication_id = m.medication_id
            JOIN medical_records mr ON pm.record_id = mr.record_id
            JOIN patients p ON mr.patient_id = p.patient_id
            JOIN doctors d ON mr.doctor_id = d.doctor_id
            ${whereClause}
            ORDER BY pm.created_at DESC 
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        queryParams.push(limit, offset);

        const result = await query(queryText, queryParams);

        // Count query
        const countQuery = `
            SELECT COUNT(*) 
            FROM prescription_medications pm
            JOIN medical_records mr ON pm.record_id = mr.record_id
            ${whereClause}
        `;
        const countResult = await query(countQuery, queryParams.slice(0, -2));

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
        console.error('Error fetching prescriptions:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch prescriptions',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/prescriptions - Create a new prescription
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['record_id', 'medication_id', 'dosage', 'frequency', 'duration'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Start a transaction
        await query('BEGIN');

        try {
            // Create prescription
            const result = await query(
                `INSERT INTO prescription_medications 
                (record_id, medication_id, dosage, frequency, duration)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    body.record_id,
                    body.medication_id,
                    body.dosage,
                    body.frequency,
                    body.duration
                ]
            );

            // Commit the transaction
            await query('COMMIT');

            return NextResponse.json({
                success: true,
                message: 'Prescription created successfully',
                data: result.rows[0]
            });
        } catch (error) {
            // Rollback the transaction on error
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error creating prescription:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create prescription',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/prescriptions/[id] - Update a prescription
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const prescriptionId = searchParams.get('id');

        if (!prescriptionId) {
            return NextResponse.json({
                success: false,
                message: 'Prescription ID is required'
            }, { status: 400 });
        }

        const body = await request.json();
        
        // Validate the update data
        if (body.frequency && !/^(once|twice|thrice|four times) (daily|weekly|monthly)$/.test(body.frequency)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid frequency format'
            }, { status: 400 });
        }

        if (body.duration && !/^\d+\s*(day|week|month)s?$/.test(body.duration)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid duration format'
            }, { status: 400 });
        }

        const result = await query(`
            UPDATE prescription_medications
            SET 
                dosage = COALESCE($1, dosage),
                frequency = COALESCE($2, frequency),
                duration = COALESCE($3, duration)
            WHERE prescription_id = $4
            RETURNING *
        `, [body.dosage, body.frequency, body.duration, prescriptionId]);

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Prescription not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Prescription updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating prescription:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update prescription',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 