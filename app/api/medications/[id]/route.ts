import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/medications/[id] - Get a specific medication
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
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
             WHERE m.medication_id = $1
             GROUP BY m.medication_id`,
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Medication not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching medication:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/medications/[id] - Update a medication
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        // Check for duplicate medication name (excluding current medication)
        const existingMed = await query(
            'SELECT * FROM medications WHERE LOWER(name) = LOWER($1) AND medication_id != $2',
            [body.name, params.id]
        );

        if (existingMed.rows.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'A medication with this name already exists'
            }, { status: 409 });
        }

        const result = await query(
            `UPDATE medications 
            SET name = COALESCE($1, name),
                description = COALESCE($2, description),
                dosage = COALESCE($3, dosage)
            WHERE medication_id = $4
            RETURNING *`,
            [
                body.name,
                body.description,
                body.dosage,
                params.id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Medication not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Medication updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating medication:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE /api/medications/[id] - Delete a medication
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check if medication is being used in any prescriptions
        const usageCheck = await query(
            'SELECT COUNT(*) FROM prescription_medications WHERE medication_id = $1',
            [params.id]
        );

        if (parseInt(usageCheck.rows[0].count) > 0) {
            return NextResponse.json({
                success: false,
                message: 'Cannot delete medication that is being used in prescriptions'
            }, { status: 409 });
        }

        const result = await query(
            'DELETE FROM medications WHERE medication_id = $1 RETURNING *',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Medication not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Medication deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting medication:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 