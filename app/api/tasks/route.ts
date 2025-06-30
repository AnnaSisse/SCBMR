import { NextRequest, NextResponse } from 'next/server';
import { createTask, getAllTasks } from '@/lib/db/medical_queries';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const task = await createTask(data);
  return NextResponse.json(task);
}

export async function GET() {
  const tasks = await getAllTasks();
  return NextResponse.json(tasks);
} 