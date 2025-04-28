"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import * as serverDb from "../../lib/server-db"

// Authentication
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = await serverDb.verifyToken(token)
    if (!decoded) return null

    const user = await serverDb.getUserById(decoded.id)
    return user
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

// Doctor data
export async function getDoctors(filters = {}) {
  return await serverDb.getAllDoctors(filters)
}

export async function getDoctor(id) {
  return await serverDb.getDoctorById(id)
}

// Appointment data
export async function getUserAppointments() {
  const user = await getCurrentUser()
  if (!user) return []

  return await serverDb.getAppointmentsByUserId(user.id)
}

export async function getAppointment(id) {
  return await serverDb.getAppointmentById(id)
}

// Booking action
export async function bookAppointment(formData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await serverDb.createAppointment({
      userId: user.id,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      status: "pending",
      reason: formData.reason || "",
    })

    // Revalidate relevant paths
    revalidatePath("/appointments")
    revalidatePath("/dashboard")

    return { success: true, error: null }
  } catch (error) {
    console.error("Error booking appointment:", error)
    return { success: false, error: "Failed to book appointment" }
  }
}

// Cancel action
export async function cancelAppointment(appointmentId) {
  try {
    const result = await serverDb.updateAppointment(appointmentId, {
      status: "cancelled",
    })

    // Revalidate the appointments page to reflect the changes
    revalidatePath("/appointments")
    revalidatePath(`/appointments/${appointmentId}`)

    return { success: result, error: null }
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return { success: false, error: "Failed to cancel appointment" }
  }
}
