import { NextRequest, NextResponse } from 'next/server';
import { createBilling, getAllBilling } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const bill = await createBilling(data);
  return NextResponse.json(bill);
}

export async function GET() {
  const bills = await getAllBilling();
  return NextResponse.json(bills);
} 