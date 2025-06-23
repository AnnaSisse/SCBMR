import { NextResponse } from 'next/server';
import { createMedicalRecord, getPatientMedicalRecords, logAudit } from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';
import { requireRole } from '@/lib/middleware/requireRole';

// POST /api/medical-records - Create a new medical record
export const POST = requireRole(['Doctor', 'Admin'])(async function POST(request: Request) {
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

        // Audit log
        const userId = Number(request.headers.get('x-user-id'));
        const ip = request.headers.get('x-forwarded-for') || '';
        await logAudit({
            user_id: userId,
            action: 'CREATE',
            resource: 'medical_record',
            resource_id: record?.record_id,
            details: JSON.stringify({ patient_id: body.patient_id, doctor_id: body.doctor_id }),
            ip_address: typeof ip === 'string' ? ip : ''
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
});

// GET /api/medical-records?patient_id=123 - Get patient's medical records
export const GET = requireRole(['Doctor', 'Admin'])(async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const patientId = searchParams.get('patient_id');
        const userId = Number(request.headers.get('x-user-id'));
        const ip = request.headers.get('x-forwarded-for') || '';

        if (!patientId) {
            // Fetch all medical records if no patient_id is provided
            const result = await query('SELECT * FROM medical_records');
            await logAudit({
                user_id: userId,
                action: 'READ_ALL',
                resource: 'medical_record',
                ip_address: typeof ip === 'string' ? ip : ''
            });
            return NextResponse.json({
                success: true,
                data: result
            });
        }

        const records = await getPatientMedicalRecords(parseInt(patientId));
        await logAudit({
            user_id: userId,
            action: 'READ',
            resource: 'medical_record',
            resource_id: Number(patientId),
            ip_address: typeof ip === 'string' ? ip : ''
        });
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
}); 