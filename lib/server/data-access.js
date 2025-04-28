// This file should NEVER be imported directly from client components
import "server-only"
import { markAsServerOnly } from "../server-only-marker"
// Mark this module as server-only
markAsServerOnly()

import { getMongoClient, createObjectId, serializeData } from "./mongodb-client"

// Database operations
export async function findOne(collection, query) {
  const client = await getMongoClient()
  const db = client.db()

  // Convert string IDs to ObjectId in the query
  const processedQuery = {}
  for (const [key, value] of Object.entries(query)) {
    if (key === "_id" && typeof value === "string") {
      processedQuery[key] = await createObjectId(value)
    } else if (key.endsWith("Id") && typeof value === "string") {
      processedQuery[key] = await createObjectId(value)
    } else {
      processedQuery[key] = value
    }
  }

  const result = await db.collection(collection).findOne(processedQuery)
  return await serializeData(result)
}

export async function find(collection, query = {}, options = {}) {
  const client = await getMongoClient()
  const db = client.db()

  // Convert string IDs to ObjectId in the query
  const processedQuery = {}
  for (const [key, value] of Object.entries(query)) {
    if (key === "_id" && typeof value === "string") {
      processedQuery[key] = await createObjectId(value)
    } else if (key.endsWith("Id") && typeof value === "string") {
      processedQuery[key] = await createObjectId(value)
    } else {
      processedQuery[key] = value
    }
  }

  const cursor = db.collection(collection).find(processedQuery)

  if (options.sort) {
    cursor.sort(options.sort)
  }

  const results = await cursor.toArray()
  return await serializeData(results)
}

export async function insertOne(collection, document) {
  const client = await getMongoClient()
  const db = client.db()

  // Process document to convert string IDs to ObjectId
  const processedDocument = {}
  for (const [key, value] of Object.entries(document)) {
    if (key.endsWith("Id") && typeof value === "string") {
      processedDocument[key] = await createObjectId(value)
    } else {
      processedDocument[key] = value
    }
  }

  const result = await db.collection(collection).insertOne({
    ...processedDocument,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id: result.insertedId.toString(), ...document }
}

export async function updateOne(collection, id, update) {
  const client = await getMongoClient()
  const db = client.db()

  // Process update to convert string IDs to ObjectId
  const processedUpdate = {}
  for (const [key, value] of Object.entries(update)) {
    if (key.endsWith("Id") && typeof value === "string") {
      processedUpdate[key] = await createObjectId(value)
    } else {
      processedUpdate[key] = value
    }
  }

  const result = await db.collection(collection).updateOne(
    { _id: await createObjectId(id) },
    {
      $set: {
        ...processedUpdate,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

export async function deleteOne(collection, id) {
  const client = await getMongoClient()
  const db = client.db()

  const result = await db.collection(collection).deleteOne({ _id: await createObjectId(id) })
  return result.deletedCount > 0
}

// User related functions
export async function getUserByEmail(email) {
  return await findOne("users", { email })
}

export async function getUserById(id) {
  return await findOne("users", { _id: id })
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

  return await find("doctors", query)
}

export async function getDoctorById(id) {
  return await findOne("doctors", { _id: id })
}

// Appointment related functions
export async function getAppointmentsByUserId(userId) {
  const appointments = await find("appointments", { userId }, { sort: { date: -1 } })

  // Fetch doctor details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await findOne("doctors", { _id: appointment.doctorId })
      appointment.doctor = doctor
      return appointment
    }),
  )

  return appointmentsWithDetails
}

export async function getAppointmentById(id) {
  const appointment = await findOne("appointments", { _id: id })

  if (!appointment) return null

  // Fetch doctor details
  const doctor = await findOne("doctors", { _id: appointment.doctorId })
  appointment.doctor = doctor

  return appointment
}

export async function createAppointment(appointmentData) {
  return await insertOne("appointments", {
    userId: appointmentData.userId,
    doctorId: appointmentData.doctorId,
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

  return await updateOne("appointments", id, updateData)
}
