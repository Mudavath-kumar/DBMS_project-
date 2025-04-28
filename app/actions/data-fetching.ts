"use server"

import "server-only"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByUserId, getAllDoctors, getDoctorById, getAppointmentById } from "@/lib/db-utils"

// Helper function to serialize MongoDB objects
function serializeData(data: any): any {
  if (!data) return null

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item))
  }

  if (data instanceof Date) {
    return data.toISOString()
  }

  if (typeof data === "object" && data !== null) {
    const serialized: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Convert ObjectId to string
      if (key === "_id" || key.endsWith("Id")) {
        serialized[key] = value.toString()
      } else {
        serialized[key] = serializeData(value)
      }
    }
    return serialized
  }

  return data
}

// User data
export async function getUserData() {
  const user = await getCurrentUser()
  return serializeData(user)
}

// Doctor data
export async function getDoctors(filters: any = {}) {
  const doctors = await getAllDoctors(filters)
  return serializeData(doctors)
}

export async function getDoctor(id: string) {
  const doctor = await getDoctorById(id)
  return serializeData(doctor)
}

// Appointment data
export async function getUserAppointments() {
  const user = await getCurrentUser()
  if (!user) return []

  const appointments = await getAppointmentsByUserId(user._id)
  return serializeData(appointments)
}

export async function getAppointment(id: string) {
  const appointment = await getAppointmentById(id)
  return serializeData(appointment)
}
