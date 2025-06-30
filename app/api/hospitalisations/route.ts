import { NextRequest, NextResponse } from 'next/server';
import {
  createHospitalisation,
  getAllHospitalisations,
  updateHospitalisationDischarge,
  getHospitalisationsByDoctor,
  getHospitalisationsByPatient
} from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';

async function getActualPatientId(patientId: string): Promise<number> {
  // First, check if this is a custom ID (like P428241)
  if (patientId.startsWith('P')) {
    // Look up the mapping
    const [mappingRows] = await query(
      'SELECT patient_id FROM patient_id_mapping WHERE custom_id = ?',
      [patientId]
    );
    
    if (mappingRows.length === 0) {
      throw new Error('Patient not found');
    }
    
    return mappingRows[0].patient_id;
  } else {
    // Handle numeric ID
    return Number(patientId);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const hospitalisation = await createHospitalisation(data);
    return NextResponse.json(hospitalisation);
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Failed to create hospitalisation' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctor_id');
  const patientId = searchParams.get('patient_id');
  let hospitalisations;
  
  try {
    if (patientId) {
      const actualPatientId = await getActualPatientId(patientId);
      hospitalisations = await getHospitalisationsByPatient(actualPatientId);
    } else if (doctorId) {
      hospitalisations = await getHospitalisationsByDoctor(Number(doctorId));
    } else {
      hospitalisations = await getAllHospitalisations();
    }
    return NextResponse.json(hospitalisations);
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Failed to fetch hospitalisations' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { hospitalisation_id, discharge_date, notes } = await req.json();
    const updated = await updateHospitalisationDischarge(hospitalisation_id, discharge_date, notes);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Failed to update hospitalisation' }, { status: 500 });
  }
} 