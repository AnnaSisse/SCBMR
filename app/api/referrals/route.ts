import { NextRequest, NextResponse } from 'next/server';
import { createReferral, getAllReferrals } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const referral = await createReferral(data);
  return NextResponse.json(referral);
}

export async function GET() {
  const referrals = await getAllReferrals();
  return NextResponse.json(referrals);
} 