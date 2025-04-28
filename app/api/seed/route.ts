import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db-utils"

export async function GET() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database seeded successfully" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "Failed to seed database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
