import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser, getUserByEmail } from "@/lib/db-utils"

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { name, email } = await request.json()

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await getUserByEmail(email)
      if (existingUser && existingUser._id.toString() !== user._id) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 409 })
      }
    }

    // Update user
    const updated = await updateUser(user._id, { name, email })

    if (!updated) {
      return NextResponse.json({ message: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
