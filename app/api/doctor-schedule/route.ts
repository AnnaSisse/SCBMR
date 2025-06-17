import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';
import { withValidation } from '@/lib/middleware/validation';

// GET /api/doctor-schedule?doctor_id=123&date=2024-03-20
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = {
            doctor_id: searchParams.get('doctor_id'),
            date: searchParams.get('date')
        };

        const validationResult = await withValidation('doctorSchedule')({
            json: async () => params
        } as Request);

        if (validationResult instanceof NextResponse) {
            return validationResult;
        }

        const { doctor_id, date } = validationResult;

        // Get doctor's schedule for the specified date
        const result = await query(`
            SELECT 
                a.appointment_id,
                a.appointment_date,
                a.status,
                a.notes,
                p.first_name as patient_first_name,
                p.last_name as patient_last_name,
                p.phone_number as patient_phone
            FROM appointments a
            JOIN patients p ON a.patient_id = p.patient_id
            WHERE a.doctor_id = $1
            AND DATE(a.appointment_date) = $2
            ORDER BY a.appointment_date
        `, [doctor_id, date]);

        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch doctor schedule',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/doctor-schedule - Set doctor's availability
export async function POST(request: Request) {
    try {
        const validationResult = await withValidation('doctorSchedule')(request);
        if (validationResult instanceof NextResponse) {
            return validationResult;
        }

        const { doctor_id, date, start_time, end_time } = validationResult;

        // Check for existing appointments in the time slot
        const existingAppointments = await query(`
            SELECT appointment_id
            FROM appointments
            WHERE doctor_id = $1
            AND DATE(appointment_date) = $2
            AND (
                (appointment_date::time >= $3::time AND appointment_date::time < $4::time)
                OR (appointment_date::time + interval '30 minutes' > $3::time AND appointment_date::time <= $4::time)
            )
        `, [doctor_id, date, start_time, end_time]);

        if (existingAppointments.rows.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'Time slot conflicts with existing appointments'
            }, { status: 400 });
        }

        // Create availability slots (30-minute intervals)
        const slots = [];
        let currentTime = new Date(`2000-01-01T${start_time}`);
        const endTime = new Date(`2000-01-01T${end_time}`);

        while (currentTime < endTime) {
            slots.push(currentTime.toTimeString().slice(0, 5));
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }

        return NextResponse.json({
            success: true,
            message: 'Available time slots generated',
            data: {
                doctor_id,
                date,
                available_slots: slots
            }
        });
    } catch (error) {
        console.error('Error setting doctor schedule:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to set doctor schedule',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// PUT /api/doctor-schedule - Update doctor's availability
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get('appointment_id');

        if (!appointmentId) {
            return NextResponse.json({
                success: false,
                message: 'Appointment ID is required'
            }, { status: 400 });
        }

        const body = await request.json();
        
        // Validate the update data
        if (body.status && !['scheduled', 'completed', 'cancelled', 'no-show'].includes(body.status)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid status value'
            }, { status: 400 });
        }

        const result = await query(`
            UPDATE appointments
            SET 
                status = COALESCE($1, status),
                notes = COALESCE($2, notes)
            WHERE appointment_id = $3
            RETURNING *
        `, [body.status, body.notes, appointmentId]);

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