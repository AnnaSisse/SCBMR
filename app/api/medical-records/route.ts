import { NextResponse } from 'next/server';
import { createMedicalRecord, getPatientMedicalRecords } from '@/lib/db/medical_queries';

// POST /api/medical-records - Create a new medical record
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.patient_id || !body.doctor_id || !body.diagnosis) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: patient_id, doctor_id, and diagnosis are required'
            }, { status: 400 });
        }

        const record = await createMedicalRecord({
            patient_id: body.patient_id,
            doctor_id: body.doctor_id,
            diagnosis: body.diagnosis,
            prescription: body.prescription
        });

        return NextResponse.json({
            success: true,
            message: 'Medical record created successfully',
            data: record
        });
    } catch (error) {
        console.error('Error creating medical record:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create medical record',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET /api/medical-records?patient_id=123 - Get patient's medical records
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

        const records = await getPatientMedicalRecords(parseInt(patientId));

        return NextResponse.json({
            success: true,
            data: records
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