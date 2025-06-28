import { NextResponse } from 'next/server';
import { createPatient, getPatient } from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';

// POST /api/patients - Register a new patient
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        console.log('Received patient data:', body);
        
        // Validate required fields
        if (!body.first_name || !body.last_name || !body.date_of_birth) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: first_name, last_name, and date_of_birth are required'
            }, { status: 400 });
        }

        // Validate date format
        const dateOfBirth = new Date(body.date_of_birth);
        if (isNaN(dateOfBirth.getTime())) {
            return NextResponse.json({
                success: false,
                message: 'Invalid date format for date_of_birth'
            }, { status: 400 });
        }

        console.log('Attempting to create patient with data:', {
            first_name: body.first_name,
            last_name: body.last_name,
            date_of_birth: dateOfBirth,
            gender: body.gender,
            phone_number: body.phone_number,
            email: body.email,
            address: body.address,
            blood_type: body.blood_type,
            emergency_contact_name: body.emergency_contact_name,
            emergency_contact_phone: body.emergency_contact_phone,
            allergies: body.allergies,
            medical_history: body.medical_history,
            insurance: body.insurance
        });

        const patient = await createPatient({
            first_name: body.first_name,
            last_name: body.last_name,
            date_of_birth: dateOfBirth,
            gender: body.gender,
            phone_number: body.phone_number,
            email: body.email,
            address: body.address,
            blood_type: body.blood_type,
            emergency_contact_name: body.emergency_contact_name,
            emergency_contact_phone: body.emergency_contact_phone,
            allergies: body.allergies,
            medical_history: body.medical_history,
            insurance: body.insurance
        });

        console.log('Patient created successfully:', patient);

        return NextResponse.json({
            success: true,
            message: 'Patient registered successfully',
            data: patient
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to register patient';
        if (error instanceof Error) {
            if (error.message.includes('ER_DUP_ENTRY')) {
                errorMessage = 'A patient with this email already exists';
            } else if (error.message.includes('ER_NO_SUCH_TABLE')) {
                errorMessage = 'Database table not found. Please initialize the database first.';
            } else if (error.message.includes('ECONNREFUSED')) {
                errorMessage = 'Database connection failed. Please check your database configuration.';
            } else {
                errorMessage = error.message;
            }
        }
        
        return NextResponse.json({
            success: false,
            message: errorMessage,
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

// PATCH /api/patients/[id] - Update patient info
export async function PATCH(request: Request) {
    try {
        // Check user role from header
        const userRole = request.headers.get('x-user-role');
        if (!userRole || (userRole !== 'Admin' && userRole !== 'Receptionist')) {
            return NextResponse.json({
                success: false,
                message: 'Forbidden: insufficient role'
            }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('id');
        if (!patientId) {
            return NextResponse.json({
                success: false,
                message: 'Patient ID is required'
            }, { status: 400 });
        }
        const body = await request.json();
        // Update patient info in DB
        const fields = [];
        const values = [];
        if (body.email) { fields.push('email = ?'); values.push(body.email); }
        if (body.phone_number) { fields.push('phone_number = ?'); values.push(body.phone_number); }
        if (body.date_of_birth) { fields.push('date_of_birth = ?'); values.push(body.date_of_birth); }
        if (body.gender) { fields.push('gender = ?'); values.push(body.gender); }
        if (body.address) { fields.push('address = ?'); values.push(body.address); }
        if (fields.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No fields to update'
            }, { status: 400 });
        }
        values.push(patientId);
        await query(`UPDATE patients SET ${fields.join(', ')} WHERE patient_id = ?`, values);
        return NextResponse.json({
            success: true,
            message: 'Patient info updated successfully'
        });
    } catch (error) {
        console.error('Error updating patient info:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update patient info',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 