import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      patient_id,
      doctor_id,
      admission_date,
      ward,
      room,
      reason,
      emergency_contact_name,
      emergency_contact_phone,
      insurance_info,
      consent_given
    } = data;

    // Validate required fields
    if (!patient_id || !doctor_id || !admission_date || !ward || !room || !reason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if patient is already admitted
    const [existingAdmission] = await query(
      'SELECT * FROM hospitalisations WHERE patient_id = ? AND discharge_date IS NULL',
      [patient_id]
    );

    if (existingAdmission.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Patient is already admitted' },
        { status: 400 }
      );
    }

    // Create admission record
    const [result] = await query(
      `INSERT INTO hospitalisations 
       (patient_id, doctor_id, admission_date, ward, room, reason, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, 'admitted', ?)`,
      [patient_id, doctor_id, admission_date, ward, room, reason, 
       `Emergency Contact: ${emergency_contact_name} (${emergency_contact_phone}). Insurance: ${insurance_info}. Consent: ${consent_given ? 'Given' : 'Not Given'}`]
    );

    // Update patient status
    await query(
      'UPDATE patients SET status = "hospitalized" WHERE patient_id = ?',
      [patient_id]
    );

    // Get the created admission record
    const [[admission]] = await query(
      'SELECT * FROM hospitalisations WHERE hospitalisation_id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Patient admitted successfully',
      admission
    });

  } catch (error) {
    console.error('Admission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to admit patient' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patient_id');
    const status = searchParams.get('status');

    let queryString = `
      SELECT h.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM hospitalisations h
      LEFT JOIN patients p ON h.patient_id = p.patient_id
      LEFT JOIN doctors d ON h.doctor_id = d.doctor_id
    `;

    const params = [];
    if (patientId) {
      queryString += ' WHERE h.patient_id = ?';
      params.push(patientId);
    }
    if (status) {
      queryString += patientId ? ' AND h.status = ?' : ' WHERE h.status = ?';
      params.push(status);
    }

    queryString += ' ORDER BY h.admission_date DESC';

    const [admissions] = await query(queryString, params);

    return NextResponse.json({
      success: true,
      admissions
    });

  } catch (error) {
    console.error('Get admissions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admissions' },
      { status: 500 }
    );
  }
} 