import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
  }
    
    // Convert to number and validate
    const patientId = parseInt(id);
    if (isNaN(patientId)) {
      return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
    }
    
    console.log('Fetching examinations for patient ID:', patientId);
    
    // Query examinations with doctor information
    const [examinations] = await query(`
      SELECT 
        e.*,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name
      FROM examinations e
      LEFT JOIN doctors d ON e.doctor_id = d.doctor_id
      WHERE e.patient_id = ?
      ORDER BY e.examination_date DESC
    `, [patientId]);
    
    console.log('Examinations found:', examinations);
    
    return NextResponse.json({ 
      success: true, 
      data: examinations 
    });
    
  } catch (error) {
    console.error('Error fetching examinations:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
  }
    
    // Convert to number and validate
    const patientId = parseInt(id);
    if (isNaN(patientId)) {
      return NextResponse.json({ success: false, message: "Invalid patient ID format" }, { status: 400 });
    }
    
    const data = await req.json();
    console.log('Creating examination for patient ID:', patientId, 'with data:', data);
    
    // Insert the examination
    const [result] = await query(`
      INSERT INTO examinations (patient_id, doctor_id, examination_type, findings, recommendations, notes, examination_date)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [
      patientId,
      data.doctor_id || 1,
      data.examination_type,
      data.findings,
      data.recommendations || null,
      data.notes || null
    ]);
    
    console.log('Examination created with ID:', result.insertId);
    
    return NextResponse.json({ 
      success: true, 
      data: { examination_id: result.insertId, ...data }
    });
    
  } catch (error) {
    console.error('Error creating examination:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
} 