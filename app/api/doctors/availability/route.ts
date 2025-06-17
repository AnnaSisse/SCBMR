import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { validateRequest } from '@/lib/middleware/validation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get('doctor_id');
        const startDate = searchParams.get('start_date');
        const endDate = searchParams.get('end_date');

        // Validate request parameters
        const validationResult = validateRequest({
            doctor_id: doctorId ? parseInt(doctorId) : undefined,
            start_date: startDate,
            end_date: endDate
        }, 'doctorAvailability');

        if (!validationResult.isValid) {
            return NextResponse.json({ error: validationResult.errors }, { status: 400 });
        }

        // Get doctor's availability schedule
        const availabilityQuery = `
            SELECT 
                da.*,
                d.first_name,
                d.last_name,
                d.specialization
            FROM doctor_availability da
            JOIN doctors d ON da.doctor_id = d.id
            WHERE da.doctor_id = $1
                AND da.start_date <= $2
                AND da.end_date >= $3
        `;

        const availabilityResult = await pool.query(availabilityQuery, [
            doctorId,
            endDate,
            startDate
        ]);

        if (availabilityResult.rows.length === 0) {
            return NextResponse.json({ error: 'No availability found for the specified period' }, { status: 404 });
        }

        // Get existing appointments for the period
        const appointmentsQuery = `
            SELECT 
                appointment_date,
                start_time,
                end_time
            FROM appointments
            WHERE doctor_id = $1
                AND appointment_date BETWEEN $2 AND $3
                AND status != 'cancelled'
        `;

        const appointmentsResult = await pool.query(appointmentsQuery, [
            doctorId,
            startDate,
            endDate
        ]);

        // Process availability and appointments to find free slots
        const availability = availabilityResult.rows[0];
        const appointments = appointmentsResult.rows;
        const freeSlots = [];

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        const currentDate = new Date(startDateTime);

        while (currentDate <= endDateTime) {
            const dayOfWeek = currentDate.getDay();
            
            // Check if doctor works on this day
            if (availability.days_of_week.includes(dayOfWeek)) {
                const startTime = new Date(`2000-01-01T${availability.start_time}`);
                const endTime = new Date(`2000-01-01T${availability.end_time}`);
                const breakStart = availability.break_start ? new Date(`2000-01-01T${availability.break_start}`) : null;
                const breakEnd = availability.break_end ? new Date(`2000-01-01T${availability.break_end}`) : null;

                // Check each 30-minute slot
                let currentSlot = new Date(startTime);
                while (currentSlot < endTime) {
                    const slotEnd = new Date(currentSlot.getTime() + 30 * 60000); // 30 minutes
                    
                    // Skip if slot is during break
                    if (breakStart && breakEnd && currentSlot >= breakStart && slotEnd <= breakEnd) {
                        currentSlot = new Date(breakEnd);
                        continue;
                    }

                    // Check if slot is already booked
                    const isBooked = appointments.some(appointment => {
                        const appointmentDate = new Date(appointment.appointment_date);
                        const appointmentStart = new Date(`2000-01-01T${appointment.start_time}`);
                        const appointmentEnd = new Date(`2000-01-01T${appointment.end_time}`);
                        
                        return appointmentDate.toDateString() === currentDate.toDateString() &&
                               currentSlot >= appointmentStart && slotEnd <= appointmentEnd;
                    });

                    if (!isBooked) {
                        freeSlots.push({
                            date: currentDate.toISOString().split('T')[0],
                            start_time: currentSlot.toTimeString().slice(0, 5),
                            end_time: slotEnd.toTimeString().slice(0, 5)
                        });
                    }

                    currentSlot = slotEnd;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return NextResponse.json({
            doctor: {
                id: availability.doctor_id,
                name: `${availability.first_name} ${availability.last_name}`,
                specialization: availability.specialization
            },
            availability_period: {
                start_date: startDate,
                end_date: endDate
            },
            free_slots: freeSlots
        });
    } catch (error) {
        console.error('Error checking doctor availability:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate request body
        const validationResult = validateRequest(body, 'doctorAvailability');
        if (!validationResult.isValid) {
            return NextResponse.json({ error: validationResult.errors }, { status: 400 });
        }

        const {
            doctor_id,
            start_date,
            end_date,
            days_of_week,
            start_time,
            end_time,
            break_start,
            break_end
        } = body;

        // Check if there's any existing availability that overlaps
        const overlapQuery = `
            SELECT id FROM doctor_availability
            WHERE doctor_id = $1
                AND (
                    (start_date <= $2 AND end_date >= $2)
                    OR (start_date <= $3 AND end_date >= $3)
                    OR (start_date >= $2 AND end_date <= $3)
                )
        `;

        const overlapResult = await pool.query(overlapQuery, [
            doctor_id,
            start_date,
            end_date
        ]);

        if (overlapResult.rows.length > 0) {
            return NextResponse.json({
                error: 'Availability period overlaps with existing schedule'
            }, { status: 400 });
        }

        // Insert new availability
        const insertQuery = `
            INSERT INTO doctor_availability (
                doctor_id,
                start_date,
                end_date,
                days_of_week,
                start_time,
                end_time,
                break_start,
                break_end
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const result = await pool.query(insertQuery, [
            doctor_id,
            start_date,
            end_date,
            days_of_week,
            start_time,
            end_time,
            break_start,
            break_end
        ]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error setting doctor availability:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 