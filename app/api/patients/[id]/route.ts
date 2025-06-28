import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id;
    
    console.log('Fetching patient with ID:', patientId);
    
    // Convert to number and validate
    const numericId = parseInt(patientId);
    if (isNaN(numericId)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid patient ID format' 
      }, { status: 400 });
    }
    
    // Query the database directly
    const [patientRows] = await query('SELECT * FROM patients WHERE patient_id = ?', [numericId]);
    
    if (patientRows.length === 0) {
      console.log('Patient not found for ID:', numericId);
      return NextResponse.json({ 
        success: false, 
        message: 'Patient not found' 
      }, { status: 404 });
    }
    
    const patient = patientRows[0];
    console.log('Patient found:', patient);
    
    return NextResponse.json({ 
      success: true, 
      data: patient 
    });
    
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 