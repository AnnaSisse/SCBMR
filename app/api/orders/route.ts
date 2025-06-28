import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getAllOrders } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const order = await createOrder(data);
  return NextResponse.json(order);
}

export async function GET() {
  const orders = await getAllOrders();
  return NextResponse.json(orders);
} 