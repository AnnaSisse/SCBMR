import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/appointments - Get all appointments with filtering
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const doctorId = searchParams.get('doctor_id');
        const patientId = searchParams.get('patient_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');
        const status = searchParams.get('status');
        const offset = (page - 1) * limit;

        // Build the base query conditions
        let conditions = [];
        const queryParams: any[] = [];
        let paramCount = 1;

        if (doctorId) {
            conditions.push(`a.doctor_id = $${paramCount}`);
            queryParams.push(doctorId);
            paramCount++;
        }

        if (patientId) {
            conditions.push(`a.patient_id = $${paramCount}`);
            queryParams.push(patientId);
            paramCount++;
        }

        if (startDate) {
            conditions.push(`a.appointment_date >= $${paramCount}`);
            queryParams.push(startDate);
            paramCount++;
        }

        if (endDate) {
            conditions.push(`a.appointment_date <= $${paramCount}`);
            queryParams.push(endDate);
            paramCount++;
        }

        if (status) {
            conditions.push(`a.status = $${paramCount}`);
            queryParams.push(status);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Main query
        const queryText = `
            SELECT a.*, 
                   p.first_name as patient_first_name, 
                   p.last_name as patient_last_name,
                   d.first_name as doctor_first_name, 
                   d.last_name as doctor_last_name,
                   d.specialization as doctor_specialization
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.patient_id
            LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
            ${whereClause}
            ORDER BY a.appointment_date DESC 
            LIMIT $${paramCount} OFFSET $${paramCount + 1}
        `;
        queryParams.push(limit, offset);

        const result = await query(queryText, queryParams);

        // Count query
        const countQuery = `
            SELECT COUNT(*) 
            FROM appointments a
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
        console.error('Error fetching appointments:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['patient_id', 'doctor_id', 'appointment_date'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Check for scheduling conflicts
        const conflictCheck = await query(
            `SELECT * FROM appointments 
            WHERE doctor_id = $1 
            AND appointment_date = $2 
            AND status != 'cancelled'`,
            [body.doctor_id, body.appointment_date]
        );

        if (conflictCheck.rows.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'Time slot is already booked'
            }, { status: 409 });
        }

        const result = await query(
            `INSERT INTO appointments 
            (patient_id, doctor_id, appointment_date, status, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                body.patient_id,
                body.doctor_id,
                body.appointment_date,
                body.status || 'scheduled',
                body.notes
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Appointment created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 