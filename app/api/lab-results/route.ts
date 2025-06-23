import { NextRequest, NextResponse } from 'next/server';
import { createLabResult, getAllLabResults } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const labResult = await createLabResult(data);
  return NextResponse.json(labResult);
}

export async function GET() {
  const labResults = await getAllLabResults();
  return NextResponse.json(labResults);
} 