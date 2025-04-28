import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"

// Connect to MongoDB
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Helper function to serialize MongoDB objects
function serializeData(data: any): any {
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
    const serialized: any = {}
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

export async function POST(request: NextRequest) {
  try {
    const { operation, params } = await request.json()

    // Authenticate user for protected operations
    const user = await getCurrentUser()
    const requiresAuth = ["getUserAppointments", "createAppointment", "updateAppointment", "deleteAppointment"]

    if (requiresAuth.includes(operation) && !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    let result

    switch (operation) {
      case "getUserByEmail":
        result = await db.collection("users").findOne({ email: params.email })
        break

      case "getUserById":
        result = await db.collection("users").findOne({ _id: new ObjectId(params.id) })
        break

      case "getAllDoctors":
        const query: any = {}
        if (params.specialty && params.specialty !== "All Specialties") {
          query.specialty = params.specialty
        }
        if (params.search) {
          query.name = { $regex: params.search, $options: "i" }
        }
        result = await db.collection("doctors").find(query).toArray()
        break

      case "getDoctorById":
        result = await db.collection("doctors").findOne({ _id: new ObjectId(params.id) })
        break

      case "getUserAppointments":
        const appointments = await db
          .collection("appointments")
          .find({ userId: new ObjectId(user.id) })
          .sort({ date: -1 })
          .toArray()

        // Fetch doctor details for each appointment
        result = await Promise.all(
          appointments.map(async (appointment) => {
            const doctor = await db.collection("doctors").findOne({ _id: appointment.doctorId })
            return {
              ...appointment,
              doctor: doctor
                ? {
                    id: doctor._id.toString(),
                    name: doctor.name,
                    specialty: doctor.specialty,
                    imageUrl: doctor.imageUrl,
                  }
                : null,
            }
          }),
        )
        break

      case "getAppointmentById":
        const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(params.id) })

        if (!appointment) {
          return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
        }

        // Check if the appointment belongs to the user or user is admin
        if (appointment.userId.toString() !== user.id && user.role !== "admin") {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Fetch doctor details
        const doctor = await db.collection("doctors").findOne({ _id: appointment.doctorId })

        result = {
          ...appointment,
          doctor: doctor
            ? {
                id: doctor._id.toString(),
                name: doctor.name,
                specialty: doctor.specialty,
                imageUrl: doctor.imageUrl,
              }
            : null,
        }
        break

      case "createAppointment":
        const insertResult = await db.collection("appointments").insertOne({
          userId: new ObjectId(user.id),
          doctorId: new ObjectId(params.doctorId),
          date: new Date(params.date),
          time: params.time,
          status: params.status,
          reason: params.reason || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        result = { id: insertResult.insertedId.toString(), success: true }
        break

      case "updateAppointment":
        const updateData: any = {
          ...params.data,
          updatedAt: new Date(),
        }

        if (params.data.date) {
          updateData.date = new Date(params.data.date)
        }

        const updateResult = await db
          .collection("appointments")
          .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

        result = { success: updateResult.modifiedCount > 0 }
        break

      case "createUser":
        const userInsertResult = await db.collection("users").insertOne({
          name: params.name,
          email: params.email,
          password: params.password,
          role: params.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        result = {
          id: userInsertResult.insertedId.toString(),
          name: params.name,
          email: params.email,
          role: params.role,
        }
        break

      default:
        return NextResponse.json({ error: "Unknown operation" }, { status: 400 })
    }

    return NextResponse.json({ data: serializeData(result) })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
