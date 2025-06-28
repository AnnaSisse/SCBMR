import { NextRequest, NextResponse } from 'next/server';
import { createMessage, getAllMessages } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const message = await createMessage(data);
  return NextResponse.json(message);
}

export async function GET() {
  const messages = await getAllMessages();
  return NextResponse.json(messages);
} 