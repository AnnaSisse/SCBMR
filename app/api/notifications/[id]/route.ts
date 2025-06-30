import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db/queries"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { action } = body

    if (action === "mark_read") {
      await query(`
        UPDATE notifications 
        SET read = true 
        WHERE id = ?
      `, [id])
      
      return NextResponse.json({ message: "Notification marked as read" })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await query(`
      DELETE FROM notifications 
      WHERE id = ?
    `, [id])
    
    return NextResponse.json({ message: "Notification deleted successfully" })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    )
  }
} 