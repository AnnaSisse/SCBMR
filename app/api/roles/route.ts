import { NextRequest, NextResponse } from 'next/server';
import { createRole, getAllRoles } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const role = await createRole(data);
  return NextResponse.json(role);
}

export async function GET() {
  const roles = await getAllRoles();
  return NextResponse.json(roles);
} 