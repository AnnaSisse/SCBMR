import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/patients/[id]/medical-records - Get all medical records for a patient
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Get medical records with doctor information
        const result = await query(
            `SELECT mr.*, 
                    d.first_name as doctor_first_name, 
                    d.last_name as doctor_last_name,
                    d.specialization as doctor_specialization
             FROM medical_records mr
             LEFT JOIN doctors d ON mr.doctor_id = d.doctor_id
             WHERE mr.patient_id = $1
             ORDER BY mr.visit_date DESC
             LIMIT $2 OFFSET $3`,
            [params.id, limit, offset]
        );

        // Get total count for pagination
        const countResult = await query(
            'SELECT COUNT(*) FROM medical_records WHERE patient_id = $1',
            [params.id]
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
        console.error('Error fetching medical records:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch medical records',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/patients/[id]/medical-records - Create a new medical record
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['doctor_id', 'diagnosis'];
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
            // Create medical record
            const recordResult = await query(
                `INSERT INTO medical_records 
                (patient_id, doctor_id, diagnosis, prescription)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [
                    params.id,
                    body.doctor_id,
                    body.diagnosis,
                    body.prescription
                ]
            );

            // If medications are provided, add them
            if (body.medications && Array.isArray(body.medications)) {
                for (const medication of body.medications) {
                    await query(
                        `INSERT INTO prescription_medications 
                        (record_id, medication_id, dosage, frequency, duration)
                        VALUES ($1, $2, $3, $4, $5)`,
                        [
                            recordResult.rows[0].record_id,
                            medication.medication_id,
                            medication.dosage,
                            medication.frequency,
                            medication.duration
                        ]
                    );
                }
            }

            // Commit the transaction
            await query('COMMIT');

            return NextResponse.json({
                success: true,
                message: 'Medical record created successfully',
                data: recordResult.rows[0]
            });
        } catch (error) {
            // Rollback the transaction on error
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error creating medical record:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create medical record',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 