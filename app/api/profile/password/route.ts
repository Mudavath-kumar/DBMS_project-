import { NextResponse } from "next/server"
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/db-utils"

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Get user with password
    const userWithPassword = await getUserById(user._id)

    if (!userWithPassword) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, userWithPassword.password)

    if (!isValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    const updated = await updateUser(user._id, { password: hashedPassword })

    if (!updated) {
      return NextResponse.json({ message: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
