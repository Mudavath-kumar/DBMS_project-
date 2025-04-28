"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyToken } from "@/lib/auth"
import * as dataFetcher from "@/lib/data-fetcher"

// Authentication
export async function getCurrentUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = await verifyToken(token)
    if (!decoded) return null

    const user = await dataFetcher.getUserById(decoded.id)
    return user
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

// Doctor data
export async function getDoctors(filters = {}) {
  return await dataFetcher.getAllDoctors(filters)
}

export async function getDoctor(id: string) {
  return await dataFetcher.getDoctorById(id)
}

// Appointment data
export async function getUserAppointments() {
  return await dataFetcher.getUserAppointments()
}

export async function getAppointment(id: string) {
  return await dataFetcher.getAppointmentById(id)
}

// Booking action
export async function bookAppointment(formData: any) {
  try {
    const result = await dataFetcher.createAppointment(formData)

    // Revalidate relevant paths
    revalidatePath("/appointments")
    revalidatePath("/dashboard")

    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error booking appointment:", error)
    return { success: false, error: error.message || "Failed to book appointment" }
  }
}

// Cancel action
export async function cancelAppointment(appointmentId: string) {
  try {
    const result = await dataFetcher.updateAppointment(appointmentId, {
      status: "cancelled",
    })

    // Revalidate the appointments page to reflect the changes
    revalidatePath("/appointments")
    revalidatePath(`/appointments/${appointmentId}`)

    return { success: true, error: null }
  } catch (error: any) {
    console.error("Error cancelling appointment:", error)
    return { success: false, error: error.message || "Failed to cancel appointment" }
  }
}
