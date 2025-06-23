import { NextRequest, NextResponse } from 'next/server';
import { addUserRole, getAllUserRoles } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await addUserRole(data);
  return NextResponse.json(result);
}

export async function GET() {
  const userRoles = await getAllUserRoles();
  return NextResponse.json(userRoles);
} 