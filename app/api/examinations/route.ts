import { NextRequest, NextResponse } from 'next/server';
import { createExamination, getAllExaminations, getExaminationsByPatient, getExaminationsByDoctor } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const exam = await createExamination(data);
  return NextResponse.json(exam);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patient_id');
  const doctorId = searchParams.get('doctor_id');
  let exams;
  if (patientId) {
    exams = await getExaminationsByPatient(Number(patientId));
  } else if (doctorId) {
    exams = await getExaminationsByDoctor(Number(doctorId));
  } else {
    exams = await getAllExaminations();
  }
  return NextResponse.json(exams);
} 