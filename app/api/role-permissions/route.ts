import { NextRequest, NextResponse } from 'next/server';
import { addRolePermission, getAllRolePermissions } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await addRolePermission(data);
  return NextResponse.json(result);
}

export async function GET() {
  const rolePermissions = await getAllRolePermissions();
  return NextResponse.json(rolePermissions);
} 