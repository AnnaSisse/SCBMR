import { NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';
import { withValidation } from '@/lib/middleware/validation';

// GET /api/patient-history?patient_id=123&start_date=2024-01-01&end_date=2024-12-31&record_type=all
export async function GET(request: Request) {
    try {
        // Validate request parameters
        const { searchParams } = new URL(request.url);
        const params = {
            patient_id: searchParams.get('patient_id'),
            start_date: searchParams.get('start_date'),
            end_date: searchParams.get('end_date'),
            record_type: searchParams.get('record_type') || 'all'
        };

        const validationResult = await withValidation('patientHistory')({
            json: async () => params
        } as Request);

        if (validationResult instanceof NextResponse) {
            return validationResult;
        }

        const { patient_id, start_date, end_date, record_type } = validationResult;

        // Build the query based on record type
        let historyQuery = '';
        const queryParams = [patient_id];

        if (start_date) {
            queryParams.push(start_date);
        }
        if (end_date) {
            queryParams.push(end_date);
        }

        switch (record_type) {
            case 'appointments':
                historyQuery = `
                    SELECT 
                        'appointment' as record_type,
                        a.appointment_id as id,
                        a.appointment_date as date,
                        a.status,
                        a.notes,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name,
                        d.specialization as doctor_specialization
                    FROM appointments a
                    JOIN doctors d ON a.doctor_id = d.doctor_id
                    WHERE a.patient_id = $1
                    ${start_date ? 'AND a.appointment_date >= $2' : ''}
                    ${end_date ? `AND a.appointment_date <= $${start_date ? '3' : '2'}` : ''}
                `;
                break;

            case 'prescriptions':
                historyQuery = `
                    SELECT 
                        'prescription' as record_type,
                        pm.prescription_id as id,
                        pm.created_at as date,
                        m.name as medication_name,
                        pm.dosage,
                        pm.frequency,
                        pm.duration,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name
                    FROM prescription_medications pm
                    JOIN medications m ON pm.medication_id = m.medication_id
                    JOIN medical_records mr ON pm.record_id = mr.record_id
                    JOIN doctors d ON mr.doctor_id = d.doctor_id
                    WHERE mr.patient_id = $1
                    ${start_date ? 'AND pm.created_at >= $2' : ''}
                    ${end_date ? `AND pm.created_at <= $${start_date ? '3' : '2'}` : ''}
                `;
                break;

            case 'medical_records':
                historyQuery = `
                    SELECT 
                        'medical_record' as record_type,
                        mr.record_id as id,
                        mr.visit_date as date,
                        mr.diagnosis,
                        mr.prescription,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name,
                        d.specialization as doctor_specialization
                    FROM medical_records mr
                    JOIN doctors d ON mr.doctor_id = d.doctor_id
                    WHERE mr.patient_id = $1
                    ${start_date ? 'AND mr.visit_date >= $2' : ''}
                    ${end_date ? `AND mr.visit_date <= $${start_date ? '3' : '2'}` : ''}
                `;
                break;

            default: // 'all'
                historyQuery = `
                    (SELECT 
                        'appointment' as record_type,
                        a.appointment_id as id,
                        a.appointment_date as date,
                        a.status,
                        a.notes,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name,
                        d.specialization as doctor_specialization
                    FROM appointments a
                    JOIN doctors d ON a.doctor_id = d.doctor_id
                    WHERE a.patient_id = $1
                    ${start_date ? 'AND a.appointment_date >= $2' : ''}
                    ${end_date ? `AND a.appointment_date <= $${start_date ? '3' : '2'}` : ''})
                    UNION ALL
                    (SELECT 
                        'prescription' as record_type,
                        pm.prescription_id as id,
                        pm.created_at as date,
                        m.name as medication_name,
                        pm.dosage,
                        pm.frequency,
                        pm.duration,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name,
                        d.specialization as doctor_specialization
                    FROM prescription_medications pm
                    JOIN medications m ON pm.medication_id = m.medication_id
                    JOIN medical_records mr ON pm.record_id = mr.record_id
                    JOIN doctors d ON mr.doctor_id = d.doctor_id
                    WHERE mr.patient_id = $1
                    ${start_date ? 'AND pm.created_at >= $2' : ''}
                    ${end_date ? `AND pm.created_at <= $${start_date ? '3' : '2'}` : ''})
                    UNION ALL
                    (SELECT 
                        'medical_record' as record_type,
                        mr.record_id as id,
                        mr.visit_date as date,
                        mr.diagnosis,
                        mr.prescription,
                        d.first_name as doctor_first_name,
                        d.last_name as doctor_last_name,
                        d.specialization as doctor_specialization
                    FROM medical_records mr
                    JOIN doctors d ON mr.doctor_id = d.doctor_id
                    WHERE mr.patient_id = $1
                    ${start_date ? 'AND mr.visit_date >= $2' : ''}
                    ${end_date ? `AND mr.visit_date <= $${start_date ? '3' : '2'}` : ''})
                `;
        }

        // Add ordering
        historyQuery += ' ORDER BY date DESC';

        const result = await query(historyQuery, queryParams);

        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching patient history:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch patient history',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 