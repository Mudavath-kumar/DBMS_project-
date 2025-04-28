import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createAppointment, getAppointmentsByUserId, getAllAppointments } from "@/lib/db-utils"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // If admin, return all appointments, otherwise return user's appointments
    const appointments = user.role === "admin" ? await getAllAppointments() : await getAppointmentsByUserId(user._id)

    return NextResponse.json({ appointments }, { status: 200 })
  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { doctorId, date, time, reason } = await request.json()

    if (!doctorId || !date || !time) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create appointment
    const appointment = await createAppointment({
      userId: user._id,
      doctorId,
      date,
      time,
      status: "pending",
      reason: reason || "",
    })

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
