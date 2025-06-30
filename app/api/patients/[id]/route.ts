import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientIdOrName = params.id;
    
    // First, check if this is a custom ID (like P428241)
    if (patientIdOrName.startsWith('P')) {
      // Look up the mapping
      const [mappingRows] = await query(
        'SELECT patient_id FROM patient_id_mapping WHERE custom_id = ?',
        [patientIdOrName]
      );
      
      if (mappingRows.length === 0) {
        return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
      }
      
      // Use the mapped patient_id
      const actualPatientId = mappingRows[0].patient_id;
      const [patientRows] = await query('SELECT * FROM patients WHERE patient_id = ?', [actualPatientId]);
      
      if (patientRows.length === 0) {
        return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: patientRows[0] });
    } else if (!isNaN(Number(patientIdOrName))) {
      // Handle numeric ID
      const [patientRows] = await query('SELECT * FROM patients WHERE patient_id = ?', [patientIdOrName]);
      
      if (patientRows.length === 0) {
        return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: patientRows[0] });
    } else {
      // Treat as name (assume format: First Last)
      const [patientRows] = await query('SELECT * FROM patients WHERE CONCAT(first_name, " ", last_name) = ?', [decodeURIComponent(patientIdOrName)]);
      if (patientRows.length === 0) {
        return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: patientRows[0] });
    }
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
} 