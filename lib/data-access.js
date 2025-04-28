// This file should NEVER be imported directly from client components
import "server-only"
import * as db from "./mongodb-isolation"

// User related functions
export async function getUserByEmail(email) {
  return await db.findOne("users", { email })
}

export async function getUserById(id) {
  return await db.findOne("users", { _id: db.createObjectId(id) })
}

// Doctor related functions
export async function getAllDoctors(filters = {}) {
  const query = {}

  if (filters.specialty && filters.specialty !== "All Specialties") {
    query.specialty = filters.specialty
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" }
  }

  return await db.find("doctors", query)
}

export async function getDoctorById(id) {
  return await db.findOne("doctors", { _id: db.createObjectId(id) })
}

// Appointment related functions
export async function getAppointmentsByUserId(userId) {
  const appointments = await db.find("appointments", { userId: db.createObjectId(userId) }, { sort: { date: -1 } })

  // Fetch doctor details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await db.findOne("doctors", { _id: db.createObjectId(appointment.doctorId) })
      appointment.doctor = doctor
      return appointment
    }),
  )

  return appointmentsWithDetails
}

export async function getAppointmentById(id) {
  const appointment = await db.findOne("appointments", { _id: db.createObjectId(id) })

  if (!appointment) return null

  // Fetch doctor details
  const doctor = await db.findOne("doctors", { _id: db.createObjectId(appointment.doctorId) })
  appointment.doctor = doctor

  return appointment
}

export async function createAppointment(appointmentData) {
  return await db.insertOne("appointments", {
    userId: db.createObjectId(appointmentData.userId),
    doctorId: db.createObjectId(appointmentData.doctorId),
    date: new Date(appointmentData.date),
    time: appointmentData.time,
    status: appointmentData.status,
    reason: appointmentData.reason || "",
  })
}

export async function updateAppointment(id, appointmentData) {
  const updateData = { ...appointmentData }

  if (appointmentData.date) {
    updateData.date = new Date(appointmentData.date)
  }

  return await db.updateOne("appointments", id, updateData)
}
