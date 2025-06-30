import { NextRequest, NextResponse } from 'next/server';
import { getPatientContactLog, addPatientContactLog } from '@/lib/db/medical_queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const patientId = Number(params.id);
  if (!patientId) return NextResponse.json({ success: false, message: 'Invalid patient ID' }, { status: 400 });
  const log = await getPatientContactLog(patientId);
  return NextResponse.json({ success: true, data: log });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const patientId = Number(params.id);
  if (!patientId) return NextResponse.json({ success: false, message: 'Invalid patient ID' }, { status: 400 });
  const data = await req.json();
  const entry = await addPatientContactLog({ patient_id: patientId, ...data });
  return NextResponse.json({ success: true, data: entry });
} 