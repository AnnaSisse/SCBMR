import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db/queries"

export async function PATCH(request: NextRequest) {
  try {
    await query(`
      UPDATE notifications 
      SET read = true 
      WHERE read = false
    `)
    
    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    )
  }
} 