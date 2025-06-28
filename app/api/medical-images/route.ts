import { NextRequest, NextResponse } from 'next/server';
import { createMedicalImage, getAllMedicalImages } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const image = await createMedicalImage(data);
  return NextResponse.json(image);
}

export async function GET() {
  const images = await getAllMedicalImages();
  return NextResponse.json(images);
} 