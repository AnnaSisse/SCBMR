import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      patient_id,
      doctor_id,
      examination_type,
      priority,
      scheduled_date,
      notes,
      department
    } = data;

    // Validate required fields
    if (!patient_id || !doctor_id || !examination_type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create examination order
    const [result] = await query(
      `INSERT INTO examinations 
       (patient_id, doctor_id, examination_type, priority, scheduled_date, notes, department, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ordered')`,
      [patient_id, doctor_id, examination_type, priority || 'normal', scheduled_date, notes, department]
    );

    // Get the created examination
    const [[examination]] = await query(
      'SELECT * FROM examinations WHERE examination_id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: 'Examination ordered successfully',
      examination
    });

  } catch (error) {
    console.error('Order examination error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to order examination' },
      { status: 500 }
    );
  }
} 