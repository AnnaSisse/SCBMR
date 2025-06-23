import { NextRequest, NextResponse } from 'next/server';
import { createDepartment, getAllDepartments } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const department = await createDepartment(data);
  return NextResponse.json(department);
}

export async function GET() {
  const departments = await getAllDepartments();
  return NextResponse.json(departments);
} 