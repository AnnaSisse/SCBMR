import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      examination_id,
      scheduled_date,
      scheduled_time,
      department,
      room,
      technician_id,
      notes
    } = data;

    // Validate required fields
    if (!examination_id || !scheduled_date || !department) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if time slot is available
    const [conflicts] = await query(
      `SELECT * FROM examinations 
       WHERE department = ? AND scheduled_date = ? AND scheduled_time = ? 
       AND status IN ('scheduled', 'in_progress')`,
      [department, scheduled_date, scheduled_time]
    );

    if (conflicts.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Time slot is not available' },
        { status: 400 }
      );
    }

    // Update examination with schedule
    await query(
      `UPDATE examinations 
       SET scheduled_date = ?, scheduled_time = ?, department = ?, room = ?, 
           technician_id = ?, notes = ?, status = 'scheduled'
       WHERE examination_id = ?`,
      [scheduled_date, scheduled_time, department, room, technician_id, notes, examination_id]
    );

    // Get the updated examination
    const [[examination]] = await query(
      'SELECT * FROM examinations WHERE examination_id = ?',
      [examination_id]
    );

    // Create notification for patient
    await query(
      `INSERT INTO notifications (user_id, message, type, related_id) 
       VALUES (?, ?, 'examination_scheduled', ?)`,
      [examination.patient_id, `Examination scheduled for ${scheduled_date} at ${scheduled_time}`, examination_id]
    );

    return NextResponse.json({
      success: true,
      message: 'Examination scheduled successfully',
      examination
    });

  } catch (error) {
    console.error('Schedule examination error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to schedule examination' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const department = searchParams.get('department');

    let queryString = `
      SELECT e.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             d.first_name as doctor_first_name, d.last_name as doctor_last_name
      FROM examinations e
      LEFT JOIN patients p ON e.patient_id = p.patient_id
      LEFT JOIN doctors d ON e.doctor_id = d.doctor_id
      WHERE e.status IN ('scheduled', 'in_progress')
    `;

    const params = [];
    if (date) {
      queryString += ' AND e.scheduled_date = ?';
      params.push(date);
    }
    if (department) {
      queryString += ' AND e.department = ?';
      params.push(department);
    }

    queryString += ' ORDER BY e.scheduled_date, e.scheduled_time';

    const [schedule] = await query(queryString, params);

    return NextResponse.json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch examination schedule' },
      { status: 500 }
    );
  }
} 