import { NextRequest, NextResponse } from 'next/server';
import { getExaminationById } from '@/lib/db/medical_queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const examination = await getExaminationById(id);
    if (!examination) {
      return NextResponse.json({ success: false, message: 'Examination not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: examination });
  } catch (error) {
    console.error('Error fetching examination:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch examination' }, { status: 500 });
  }
} 