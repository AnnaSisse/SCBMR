import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/patients/[id] - Get a specific patient
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            'SELECT * FROM patients WHERE patient_id = $1',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Patient not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch patient',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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
            `UPDATE patients 
            SET first_name = $1,
                last_name = $2,
                date_of_birth = $3,
                gender = $4,
                phone_number = $5,
                email = $6,
                address = $7
            WHERE patient_id = $8
            RETURNING *`,
            [
                body.first_name,
                body.last_name,
                body.date_of_birth,
                body.gender,
                body.phone_number,
                body.email,
                body.address,
                params.id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Patient not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Patient updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update patient',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            'DELETE FROM patients WHERE patient_id = $1 RETURNING *',
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Patient not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Patient deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete patient',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 