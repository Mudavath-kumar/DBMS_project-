// This file is completely isolated and only used on the server
"use server"

// Import server-only marker
import "server-only"

// This function will be called only on the server
export async function executeServerOperation(operation, ...args) {
  try {
    // Dynamically import MongoDB only on the server
    const { MongoClient, ObjectId } = await import("mongodb")

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    const client = new MongoClient(process.env.MONGODB_URI)

    try {
      await client.connect()
      const db = client.db()

      // Execute the requested operation
      let result

      switch (operation) {
        case "findOne":
          const [collection, query] = args
          // Convert string IDs to ObjectId
          const processedQuery = {}
          for (const [key, value] of Object.entries(query)) {
            if ((key === "_id" || key.endsWith("Id")) && typeof value === "string") {
              processedQuery[key] = new ObjectId(value)
            } else {
              processedQuery[key] = value
            }
          }
          result = await db.collection(collection).findOne(processedQuery)
          break

        case "find":
          const [findCollection, findQuery, options = {}] = args
          // Convert string IDs to ObjectId
          const processedFindQuery = {}
          for (const [key, value] of Object.entries(findQuery || {})) {
            if ((key === "_id" || key.endsWith("Id")) && typeof value === "string") {
              processedFindQuery[key] = new ObjectId(value)
            } else {
              processedFindQuery[key] = value
            }
          }
          const cursor = db.collection(findCollection).find(processedFindQuery)
          if (options.sort) {
            cursor.sort(options.sort)
          }
          result = await cursor.toArray()
          break

        case "insertOne":
          const [insertCollection, document] = args
          // Convert string IDs to ObjectId
          const processedDocument = {}
          for (const [key, value] of Object.entries(document)) {
            if (key.endsWith("Id") && typeof value === "string") {
              processedDocument[key] = new ObjectId(value)
            } else {
              processedDocument[key] = value
            }
          }
          const insertResult = await db.collection(insertCollection).insertOne({
            ...processedDocument,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          result = { id: insertResult.insertedId.toString(), ...document }
          break

        case "updateOne":
          const [updateCollection, id, update] = args
          // Convert string IDs to ObjectId
          const processedUpdate = {}
          for (const [key, value] of Object.entries(update)) {
            if (key.endsWith("Id") && typeof value === "string") {
              processedUpdate[key] = new ObjectId(value)
            } else {
              processedUpdate[key] = value
            }
          }
          const updateResult = await db.collection(updateCollection).updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                ...processedUpdate,
                updatedAt: new Date(),
              },
            },
          )
          result = updateResult.modifiedCount > 0
          break

        case "deleteOne":
          const [deleteCollection, deleteId] = args
          const deleteResult = await db.collection(deleteCollection).deleteOne({
            _id: new ObjectId(deleteId),
          })
          result = deleteResult.deletedCount > 0
          break

        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      // Serialize MongoDB objects
      return serializeData(result)
    } finally {
      await client.close()
    }
  } catch (error) {
    console.error(`Error executing server operation ${operation}:`, error)
    throw error
  }
}

// Helper function to serialize MongoDB objects
function serializeData(data) {
  if (!data) return null

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item))
  }

  if (data instanceof Date) {
    return data.toISOString()
  }

  // Check if data is ObjectId (can't use instanceof here due to dynamic import)
  if (data && typeof data === "object" && data.constructor && data.constructor.name === "ObjectId") {
    return data.toString()
  }

  if (typeof data === "object" && data !== null) {
    const serialized = {}
    for (const [key, value] of Object.entries(data)) {
      if (key === "_id") {
        serialized.id = value.toString()
      } else if (value && typeof value === "object" && value.constructor && value.constructor.name === "ObjectId") {
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
  return await executeServerOperation("findOne", "users", { email })
}

export async function getUserById(id) {
  return await executeServerOperation("findOne", "users", { _id: id })
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

  return await executeServerOperation("find", "doctors", query)
}

export async function getDoctorById(id) {
  return await executeServerOperation("findOne", "doctors", { _id: id })
}

// Appointment related functions
export async function getAppointmentsByUserId(userId) {
  const appointments = await executeServerOperation("find", "appointments", { userId }, { sort: { date: -1 } })

  // Fetch doctor details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await executeServerOperation("findOne", "doctors", { _id: appointment.doctorId })
      appointment.doctor = doctor
      return appointment
    }),
  )

  return appointmentsWithDetails
}

export async function getAppointmentById(id) {
  const appointment = await executeServerOperation("findOne", "appointments", { _id: id })

  if (!appointment) return null

  // Fetch doctor details
  const doctor = await executeServerOperation("findOne", "doctors", { _id: appointment.doctorId })
  appointment.doctor = doctor

  return appointment
}

export async function createAppointment(appointmentData) {
  return await executeServerOperation("insertOne", "appointments", {
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

  return await executeServerOperation("updateOne", "appointments", id, updateData)
}

// Authentication functions
export async function hashPassword(password) {
  const bcrypt = await import("bcryptjs")
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  const bcrypt = await import("bcryptjs")
  return await bcrypt.compare(password, hashedPassword)
}

export async function createToken(user) {
  const jwt = await import("jsonwebtoken")
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  return token
}

export async function verifyToken(token) {
  try {
    const jwt = await import("jsonwebtoken")
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}
