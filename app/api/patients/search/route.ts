import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { validateRequest } from '@/lib/middleware/validation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query') || '';
        const gender = searchParams.get('gender');
        const ageMin = searchParams.get('age_min');
        const ageMax = searchParams.get('age_max');
        const lastVisitBefore = searchParams.get('last_visit_before');
        const lastVisitAfter = searchParams.get('last_visit_after');
        const hasActivePrescription = searchParams.get('has_active_prescription');
        const specialization = searchParams.get('specialization');

        // Validate request parameters
        const validationResult = validateRequest({
            query,
            gender,
            age_min: ageMin ? parseInt(ageMin) : undefined,
            age_max: ageMax ? parseInt(ageMax) : undefined,
            last_visit_before: lastVisitBefore,
            last_visit_after: lastVisitAfter,
            has_active_prescription: hasActivePrescription === 'true',
            specialization
        }, 'patientSearch');

        if (!validationResult.isValid) {
            return NextResponse.json({ error: validationResult.errors }, { status: 400 });
        }

        // Build the query
        let sqlQuery = `
            SELECT 
                p.*,
                COUNT(DISTINCT a.id) as total_appointments,
                MAX(a.appointment_date) as last_appointment_date,
                COUNT(DISTINCT pr.id) as total_prescriptions,
                COUNT(DISTINCT CASE WHEN pr.status = 'active' THEN pr.id END) as active_prescriptions
            FROM patients p
            LEFT JOIN appointments a ON p.id = a.patient_id
            LEFT JOIN prescriptions pr ON p.id = pr.patient_id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (query) {
            sqlQuery += `
                AND (
                    p.first_name ILIKE $${params.length + 1}
                    OR p.last_name ILIKE $${params.length + 1}
                    OR p.email ILIKE $${params.length + 1}
                    OR p.phone ILIKE $${params.length + 1}
                )
            `;
            params.push(`%${query}%`);
        }

        if (gender) {
            sqlQuery += ` AND p.gender = $${params.length + 1}`;
            params.push(gender);
        }

        if (ageMin) {
            sqlQuery += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) >= $${params.length + 1}`;
            params.push(ageMin);
        }

        if (ageMax) {
            sqlQuery += ` AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) <= $${params.length + 1}`;
            params.push(ageMax);
        }

        if (lastVisitBefore) {
            sqlQuery += ` AND a.appointment_date <= $${params.length + 1}`;
            params.push(lastVisitBefore);
        }

        if (lastVisitAfter) {
            sqlQuery += ` AND a.appointment_date >= $${params.length + 1}`;
            params.push(lastVisitAfter);
        }

        if (hasActivePrescription === 'true') {
            sqlQuery += ` AND EXISTS (
                SELECT 1 FROM prescriptions pr
                WHERE pr.patient_id = p.id AND pr.status = 'active'
            )`;
        }

        if (specialization) {
            sqlQuery += ` AND EXISTS (
                SELECT 1 FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                WHERE a.patient_id = p.id AND d.specialization = $${params.length + 1}
            )`;
            params.push(specialization);
        }

        sqlQuery += `
            GROUP BY p.id
            ORDER BY p.last_name, p.first_name
        `;

        const result = await pool.query(sqlQuery, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error searching patients:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 