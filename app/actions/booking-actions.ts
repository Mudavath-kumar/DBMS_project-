"use server"

import { createAppointment } from "@/lib/db-utils"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
