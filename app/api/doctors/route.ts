import { NextResponse } from "next/server"
import { getAllDoctors, createDoctor } from "@/lib/db-utils"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get("specialty")
    const search = searchParams.get("search")

    const doctors = await getAllDoctors({
      specialty,
      search,
    })

    return NextResponse.json({ doctors }, { status: 200 })
  } catch (error) {
    console.error("Get doctors error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const doctorData = await request.json()

    // Validate required fields
    if (!doctorData.name || !doctorData.specialty) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const doctor = await createDoctor(doctorData)

    return NextResponse.json(
      {
        message: "Doctor created successfully",
        doctor,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create doctor error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
