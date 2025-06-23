import { NextRequest, NextResponse } from 'next/server';
import { createNotification, getAllNotifications } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const notification = await createNotification(data);
  return NextResponse.json(notification);
}

export async function GET() {
  const notifications = await getAllNotifications();
  return NextResponse.json(notifications);
} 