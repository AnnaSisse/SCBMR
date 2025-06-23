import { NextResponse } from 'next/server';
import { createMedication, addPrescriptionMedication } from '@/lib/db/medical_queries';
import { withValidation } from '@/lib/middleware/validation';
import { query } from '@/lib/db/queries';

// POST /api/medications - Add a new medication
export async function POST(request: Request) {
    try {
        // Validate request body
        const validationResult = await withValidation('medication')(request);
        if (validationResult instanceof NextResponse) {
            return validationResult;
        }

        const medication = await createMedication(validationResult);

        return NextResponse.json({
            success: true,
            message: 'Medication added successfully',
            data: medication
        });
    } catch (error) {
        console.error('Error adding medication:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to add medication',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET /api/medications - Get all medications
export async function GET() {
    try {
        const result = await query('SELECT * FROM medications ORDER BY name');
        
        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching medications:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch medications',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/medications/prescribe - Add medication to a prescription
export async function prescribe(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.record_id || !body.medication_id || !body.dosage || !body.frequency || !body.duration) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: record_id, medication_id, dosage, frequency, and duration are required'
            }, { status: 400 });
        }

        const prescription = await addPrescriptionMedication({
            record_id: body.record_id,
            medication_id: body.medication_id,
            dosage: body.dosage,
            frequency: body.frequency,
            duration: body.duration
        });

        return NextResponse.json({
            success: true,
            message: 'Medication added to prescription successfully',
            data: prescription
        });
    } catch (error) {
        console.error('Error adding medication to prescription:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to add medication to prescription',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 