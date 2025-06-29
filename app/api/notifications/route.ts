import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/queries';
import { ResultSetHeader } from 'mysql2';
import pool from '@/lib/db/config';

export async function GET() {
  try {
    const notifications = await query(`
      SELECT * FROM notifications 
      ORDER BY timestamp DESC
    `);
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, type, title, message, action_url } = body;

    const [result] = await pool.query(`
      INSERT INTO notifications (user_id, type, title, message, action_url, timestamp, read)
      VALUES (?, ?, ?, ?, ?, NOW(), false)
    `, [user_id, type, title, message, action_url]) as [ResultSetHeader, any];

    return NextResponse.json({ 
      message: "Notification created successfully",
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "mark_all_read") {
      await query(`
        UPDATE notifications 
        SET read = true 
        WHERE read = false
      `);
      
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
} 