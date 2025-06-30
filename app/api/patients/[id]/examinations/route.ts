import { NextRequest, NextResponse } from 'next/server';
import { getExaminationsByPatient, createExamination } from '@/lib/db/medical_queries';
import { query } from '@/lib/db/queries';

async function getActualPatientId(patientId: string): Promise<number> {
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
    return Number(patientId);
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
  }
  let actualPatientId;
  try {
    actualPatientId = await getActualPatientId(id);
    if (!actualPatientId || isNaN(actualPatientId)) {
      return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
    }
    const examinations = await getExaminationsByPatient(actualPatientId);
    return NextResponse.json({ success: true, data: examinations });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
  }
  let actualPatientId;
  try {
    actualPatientId = await getActualPatientId(id);
    if (!actualPatientId || isNaN(actualPatientId)) {
      return NextResponse.json({ success: false, message: "Invalid patient ID" }, { status: 400 });
    }
    const data = await req.json();
    const examination = await createExamination({ ...data, patient_id: actualPatientId });
    return NextResponse.json({ success: true, data: examination });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
} 