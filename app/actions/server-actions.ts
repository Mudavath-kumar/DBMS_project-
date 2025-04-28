"use server"

import { getCurrentUser } from "@/lib/auth"
import {
  getAppointmentsByUserId,
  getAllDoctors,
  getDoctorById,
  getAppointmentById,
  createAppointment,
  updateAppointment,
} from "@/lib/db-utils"
import { revalidatePath } from "next/cache"

// User actions
export async function getUserProfile() {
  try {
    const user = await getCurrentUser()
    return { success: true, user }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { success: false, error: "Failed to get user profile" }
  }
}

// Doctor actions
export async function fetchDoctors(filters: any = {}) {
  try {
    const doctors = await getAllDoctors(filters)
    return { success: true, doctors }
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return { success: false, error: "Failed to fetch doctors" }
  }
}

export async function fetchDoctorById(id: string) {
  try {
    const doctor = await getDoctorById(id)
    return { success: true, doctor }
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return { success: false, error: "Failed to fetch doctor" }
  }
}

// Appointment actions
export async function fetchUserAppointments() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const appointments = await getAppointmentsByUserId(user._id)
    return { success: true, appointments }
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return { success: false, error: "Failed to fetch appointments" }
  }
}

export async function fetchAppointmentById(id: string) {
  try {
    const appointment = await getAppointmentById(id)
    return { success: true, appointment }
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return { success: false, error: "Failed to fetch appointment" }
  }
}

export async function bookAppointment(formData: {
  doctorId: string
  date: string
  time: string
  reason: string
}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await createAppointment({
      userId: user._id,
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

export async function cancelAppointment(appointmentId: string) {
  try {
    const result = await updateAppointment(appointmentId, {
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
