import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

// GET /api/medications/interactions - Get interactions for a medication
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const medicationId = searchParams.get('medicationId');

        if (!medicationId) {
            return NextResponse.json({
                success: false,
                message: 'Medication ID is required'
            }, { status: 400 });
        }

        const result = await query(
            `SELECT mi.*, 
                    m1.name as medication_1_name,
                    m2.name as medication_2_name
             FROM medication_interactions mi
             JOIN medications m1 ON mi.medication_id_1 = m1.medication_id
             JOIN medications m2 ON mi.medication_id_2 = m2.medication_id
             WHERE mi.medication_id_1 = $1 OR mi.medication_id_2 = $1
             ORDER BY mi.severity DESC`,
            [medicationId]
        );

        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching medication interactions:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch medication interactions',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// POST /api/medications/interactions - Add a new interaction
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate required fields
        const requiredFields = ['medication_id_1', 'medication_id_2', 'severity', 'description'];
        const missingFields = requiredFields.filter(field => !body[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Ensure medication_id_1 is always the smaller ID to maintain consistency
        const [med1, med2] = [body.medication_id_1, body.medication_id_2].sort((a, b) => a - b);

        const result = await query(
            `INSERT INTO medication_interactions (
                medication_id_1,
                medication_id_2,
                severity,
                description
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [med1, med2, body.severity, body.description]
        );

        return NextResponse.json({
            success: true,
            message: 'Medication interaction added successfully',
            data: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding medication interaction:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to add medication interaction',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 