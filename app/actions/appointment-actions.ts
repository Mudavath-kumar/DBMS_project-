"use server"

import { updateAppointment } from "@/lib/db-utils"
import { revalidatePath } from "next/cache"

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
