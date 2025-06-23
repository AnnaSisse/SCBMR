import { NextRequest, NextResponse } from 'next/server';
import { createPermission, getAllPermissions } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const permission = await createPermission(data);
  return NextResponse.json(permission);
}

export async function GET() {
  const permissions = await getAllPermissions();
  return NextResponse.json(permissions);
} 