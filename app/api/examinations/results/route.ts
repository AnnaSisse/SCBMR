import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      examination_id,
      technician_id,
      result_data,
      result_date,
      status,
      notes,
      abnormal_findings
    } = data;

    // Validate required fields
    if (!examination_id || !technician_id || !result_data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update examination with results
    await query(
      `UPDATE examinations 
       SET result_data = ?, result_date = ?, status = ?, notes = ?, abnormal_findings = ?
       WHERE examination_id = ?`,
      [JSON.stringify(result_data), result_date || new Date(), status || 'completed', notes, abnormal_findings, examination_id]
    );

    // Get the updated examination
    const [[examination]] = await query(
      'SELECT * FROM examinations WHERE examination_id = ?',
      [examination_id]
    );

    // If abnormal findings, create notification for doctor
    if (abnormal_findings) {
      await query(
        `INSERT INTO notifications (user_id, message, type, related_id) 
         VALUES (?, ?, 'abnormal_result', ?)`,
        [examination.doctor_id, `Abnormal findings in examination ${examination_id}`, examination_id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Examination results recorded successfully',
      examination
    });

  } catch (error) {
    console.error('Record results error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record examination results' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const examinationId = searchParams.get('examination_id');
    const patientId = searchParams.get('patient_id');

    let queryString = `
      SELECT e.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM examinations e
      LEFT JOIN patients p ON e.patient_id = p.patient_id
      LEFT JOIN doctors d ON e.doctor_id = d.doctor_id
    `;

    const params = [];
    if (examinationId) {
      queryString += ' WHERE e.examination_id = ?';
      params.push(examinationId);
    } else if (patientId) {
      queryString += ' WHERE e.patient_id = ?';
      params.push(patientId);
    }

    queryString += ' ORDER BY e.result_date DESC';

    const [results] = await query(queryString, params);

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch examination results' },
      { status: 500 }
    );
  }
} 