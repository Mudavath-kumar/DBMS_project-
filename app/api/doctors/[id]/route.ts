import { NextResponse } from "next/server"
import { getDoctorById, updateDoctor } from "@/lib/db-utils"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const doctor = await getDoctorById(params.id)

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    return NextResponse.json({ doctor }, { status: 200 })
  } catch (error) {
    console.error("Get doctor error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const doctor = await getDoctorById(params.id)

    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 })
    }

    const doctorData = await request.json()

    const updated = await updateDoctor(params.id, doctorData)

    if (!updated) {
      return NextResponse.json({ message: "Failed to update doctor" }, { status: 500 })
    }

    return NextResponse.json({ message: "Doctor updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Update doctor error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
