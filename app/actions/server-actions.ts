"use server"

import "server-only"
import { getCurrentUser } from "@/lib/auth"
import { createAppointment, updateAppointment } from "@/lib/db-utils"
import { revalidatePath } from "next/cache"

// Booking action
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

// Cancel action
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
