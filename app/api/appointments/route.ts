import { NextResponse } from 'next/server';
import { createAppointment, getPatientAppointments } from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';

// POST /api/appointments - Schedule a new appointment
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.patient_id || !body.doctor_id || !body.appointment_date) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: patient_id, doctor_id, and appointment_date are required'
            }, { status: 400 });
        }

        const appointment = await createAppointment({
            patient_id: body.patient_id,
            doctor_id: body.doctor_id,
            appointment_date: new Date(body.appointment_date),
            status: body.status,
            notes: body.notes
        });

        return NextResponse.json({
            success: true,
            message: 'Appointment scheduled successfully',
            data: appointment
        });
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to schedule appointment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET /api/appointments?patient_id=123 - Get patient's appointments
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patient_id');

        if (!patientId) {
            return NextResponse.json({
                success: false,
                message: 'Patient ID is required'
            }, { status: 400 });
        }

        const appointments = await getPatientAppointments(parseInt(patientId));

        return NextResponse.json({
            success: true,
            data: appointments
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