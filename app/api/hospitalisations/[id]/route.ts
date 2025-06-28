import { NextRequest, NextResponse } from 'next/server';
import { getHospitalisationById } from '@/lib/db/medical_queries';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const hospitalisation = await getHospitalisationById(id);
    
    if (!hospitalisation) {
      return NextResponse.json({ success: false, message: 'Hospitalisation not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: hospitalisation });
  } catch (error) {
    console.error('Error fetching hospitalisation:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch hospitalisation' }, { status: 500 });
  }
} 