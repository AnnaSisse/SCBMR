import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/appointments/[id] - Get a specific appointment
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            `SELECT a.*, 
                    p.first_name as patient_first_name, 
                    p.last_name as patient_last_name,
                    d.first_name as doctor_first_name, 
                    d.last_name as doctor_last_name,
                    d.specialization as doctor_specialization
             FROM appointments a
             LEFT JOIN patients p ON a.patient_id = p.patient_id
             LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
             WHERE a.appointment_id = $1`,
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Appointment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/appointments/[id] - Update an appointment
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['appointment_date'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Check for scheduling conflicts if date is being changed
        if (body.appointment_date) {
            const conflictCheck = await query(
                `SELECT * FROM appointments 
                WHERE doctor_id = $1 
                AND appointment_date = $2 
                AND appointment_id != $3
                AND status != 'cancelled'`,
                [body.doctor_id, body.appointment_date, params.id]
            );

            if (conflictCheck.rows.length > 0) {
                return NextResponse.json({
                    success: false,
                    message: 'Time slot is already booked'
                }, { status: 409 });
            }
        }

        const result = await query(
            `UPDATE appointments 
            SET appointment_date = COALESCE($1, appointment_date),
                status = COALESCE($2, status),
                notes = COALESCE($3, notes)
            WHERE appointment_id = $4
            RETURNING *`,
            [
                body.appointment_date,
                body.status,
                body.notes,
                params.id
            ]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Appointment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// DELETE /api/appointments/[id] - Cancel an appointment
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const result = await query(
            `UPDATE appointments 
            SET status = 'cancelled'
            WHERE appointment_id = $1
            RETURNING *`,
            [params.id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Appointment not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment cancelled successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 