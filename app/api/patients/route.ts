import { NextResponse } from 'next/server';
import { createPatient, getPatient } from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';

// POST /api/patients - Register a new patient
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.first_name || !body.last_name || !body.date_of_birth) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: first_name, last_name, and date_of_birth are required'
            }, { status: 400 });
        }

        const patient = await createPatient({
            first_name: body.first_name,
            last_name: body.last_name,
            date_of_birth: new Date(body.date_of_birth),
            gender: body.gender,
            phone_number: body.phone_number,
            email: body.email,
            address: body.address
        });

        return NextResponse.json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to register patient',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET /api/patients/[id] - Get patient details
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('id');

        if (!patientId) {
            // Fetch all patients if no ID is provided
            const result = await query('SELECT * FROM patients');
            return NextResponse.json({
                success: true,
                data: result
            });
        }

        const patient = await getPatient(parseInt(patientId));
        if (!patient) {
            return NextResponse.json({
                success: false,
                message: 'Patient not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: patient
        });
    } catch (error) {
        console.error('Error fetching patient:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch patient details',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 