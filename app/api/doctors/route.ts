import { NextResponse } from 'next/server';
import { createDoctor } from '@/lib/db/medical_queries';
import { withValidation } from '@/lib/middleware/validation';
import { query } from '@/lib/db/queries';

// POST /api/doctors - Register a new doctor
export async function POST(request: Request) {
    try {
        // Validate request body
        const validationResult = await withValidation('doctor')(request);
        if (validationResult instanceof NextResponse) {
            return validationResult;
        }

        const doctor = await createDoctor(validationResult);

        return NextResponse.json({
            success: true,
            message: 'Doctor registered successfully',
            data: doctor
        });
    } catch (error) {
        console.error('Error registering doctor:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to register doctor',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// GET /api/doctors - Get all doctors
export async function GET() {
    try {
        const result = await query('SELECT * FROM doctors ORDER BY last_name, first_name');
        
        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 