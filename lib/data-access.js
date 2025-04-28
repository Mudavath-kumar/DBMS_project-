// This file should NEVER be imported directly from client components
import "server-only"
import { ObjectId } from "mongodb"
import clientPromise from "./mongodb-client"

// Helper function to serialize MongoDB objects
export function serializeData(data) {
  if (!data) return null

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item))
  }

  if (data instanceof Date) {
    return data.toISOString()
  }

  if (data instanceof ObjectId) {
    return data.toString()
  }

  if (typeof data === "object" && data !== null) {
    const serialized = {}
    for (const [key, value] of Object.entries(data)) {
      if (key === "_id") {
        serialized.id = value.toString()
      } else if (value instanceof ObjectId) {
        serialized[key] = value.toString()
      } else {
        serialized[key] = serializeData(value)
      }
    }
    return serialized
  }

  return data
}

// User related functions
export async function getUserByEmail(email) {
  const client = await clientPromise
  const db = client.db()
  const user = await db.collection("users").findOne({ email })
  return serializeData(user)
}

export async function getUserById(id) {
  const client = await clientPromise
  const db = client.db()
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
  return serializeData(user)
}

// Doctor related functions
export async function getAllDoctors(filters = {}) {
  const client = await clientPromise
  const db = client.db()

  const query = {}

  if (filters.specialty && filters.specialty !== "All Specialties") {
    query.specialty = filters.specialty
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" }
  }

  const doctors = await db.collection("doctors").find(query).toArray()
  return serializeData(doctors)
}

export async function getDoctorById(id) {
  const client = await clientPromise
  const db = client.db()
  const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(id) })
  return serializeData(doctor)
}

// Appointment related functions
export async function getAppointmentsByUserId(userId) {
  const client = await clientPromise
  const db = client.db()

  const appointments = await db
    .collection("appointments")
    .find({ userId: new ObjectId(userId) })
    .sort({ date: -1 })
    .toArray()

  // Fetch doctor details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await db.collection("doctors").findOne({ _id: appointment.doctorId })

      const serializedAppointment = serializeData(appointment)
      serializedAppointment.doctor = serializeData(doctor)

      return serializedAppointment
    }),
  )

  return appointmentsWithDetails
}

export async function getAppointmentById(id) {
  const client = await clientPromise
  const db = client.db()

  const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(id) })

  if (!appointment) return null

  // Fetch doctor details
  const doctor = await db.collection("doctors").findOne({ _id: appointment.doctorId })

  const serializedAppointment = serializeData(appointment)
  serializedAppointment.doctor = serializeData(doctor)

  return serializedAppointment
}

export async function createAppointment(appointmentData) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("appointments").insertOne({
    userId: new ObjectId(appointmentData.userId),
    doctorId: new ObjectId(appointmentData.doctorId),
    date: new Date(appointmentData.date),
    time: appointmentData.time,
    status: appointmentData.status,
    reason: appointmentData.reason || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return serializeData({ id: result.insertedId, ...appointmentData })
}

export async function updateAppointment(id, appointmentData) {
  const client = await clientPromise
  const db = client.db()

  const updateData = {
    ...appointmentData,
    updatedAt: new Date(),
  }

  if (appointmentData.date) {
    updateData.date = new Date(appointmentData.date)
  }

  const result = await db.collection("appointments").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  return result.modifiedCount > 0
}
