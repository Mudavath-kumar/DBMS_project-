import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentById, updateAppointment, deleteAppointment } from "@/lib/db-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const appointment = await getAppointmentById(params.id)

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check if the appointment belongs to the user or user is admin
    if (appointment.userId.toString() !== user._id && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ appointment }, { status: 200 })
  } catch (error) {
    console.error("Get appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const appointment = await getAppointmentById(params.id)

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check if the appointment belongs to the user or user is admin
    if (appointment.userId.toString() !== user._id && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { date, time, status, reason } = await request.json()

    // Update appointment
    const updated = await updateAppointment(params.id, {
      ...(date && { date }),
      ...(time && { time }),
      ...(status && { status }),
      ...(reason !== undefined && { reason }),
    })

    if (!updated) {
      return NextResponse.json({ message: "Failed to update appointment" }, { status: 500 })
    }

    return NextResponse.json({ message: "Appointment updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Update appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const appointment = await getAppointmentById(params.id)

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    // Check if the appointment belongs to the user or user is admin
    if (appointment.userId.toString() !== user._id && user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Delete appointment
    const deleted = await deleteAppointment(params.id)

    if (!deleted) {
      return NextResponse.json({ message: "Failed to delete appointment" }, { status: 500 })
    }

    return NextResponse.json({ message: "Appointment deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Delete appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
