import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// User related functions
export async function createUser(userData: any) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("users").insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id: result.insertedId, ...userData }
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ email })
  return user
}

export async function getUserById(id: string) {
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
  return user
}

export async function updateUser(id: string, userData: any) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...userData,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

// Doctor related functions
export async function getAllDoctors(filters: any = {}) {
  const client = await clientPromise
  const db = client.db()

  const query: any = {}

  if (filters.specialty && filters.specialty !== "All Specialties") {
    query.specialty = filters.specialty
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" }
  }

  const doctors = await db.collection("doctors").find(query).toArray()
  return doctors.map((doctor) => ({
    ...doctor,
    id: doctor._id.toString(),
  }))
}

export async function getDoctorById(id: string) {
  const client = await clientPromise
  const db = client.db()

  const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(id) })

  if (!doctor) return null

  return {
    ...doctor,
    id: doctor._id.toString(),
  }
}

export async function createDoctor(doctorData: any) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("doctors").insertOne({
    ...doctorData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id: result.insertedId, ...doctorData }
}

export async function updateDoctor(id: string, doctorData: any) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("doctors").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...doctorData,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

// Appointment related functions
export async function createAppointment(appointmentData: any) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("appointments").insertOne({
    ...appointmentData,
    userId: new ObjectId(appointmentData.userId),
    doctorId: new ObjectId(appointmentData.doctorId),
    date: new Date(appointmentData.date),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return { id: result.insertedId.toString(), ...appointmentData }
}

export async function getAppointmentsByUserId(userId: string) {
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

      return {
        ...appointment,
        id: appointment._id.toString(),
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

  return appointmentsWithDetails
}

export async function getAppointmentById(id: string) {
  const client = await clientPromise
  const db = client.db()

  const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(id) })

  if (!appointment) return null

  // Fetch doctor details
  const doctor = await db.collection("doctors").findOne({ _id: appointment.doctorId })

  return {
    ...appointment,
    id: appointment._id.toString(),
    doctor: doctor
      ? {
          id: doctor._id.toString(),
          name: doctor.name,
          specialty: doctor.specialty,
          imageUrl: doctor.imageUrl,
        }
      : null,
  }
}

export async function updateAppointment(id: string, appointmentData: any) {
  const client = await clientPromise
  const db = client.db()

  const updateData: any = {
    ...appointmentData,
    updatedAt: new Date(),
  }

  if (appointmentData.date) {
    updateData.date = new Date(appointmentData.date)
  }

  const result = await db.collection("appointments").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  return result.modifiedCount > 0
}

export async function deleteAppointment(id: string) {
  const client = await clientPromise
  const db = client.db()

  const result = await db.collection("appointments").deleteOne({ _id: new ObjectId(id) })

  return result.deletedCount > 0
}

// Admin functions
export async function getAllUsers() {
  const client = await clientPromise
  const db = client.db()

  const users = await db.collection("users").find().toArray()

  return users.map((user) => ({
    ...user,
    id: user._id.toString(),
    password: undefined, // Don't return passwords
  }))
}

export async function getAllAppointments() {
  const client = await clientPromise
  const db = client.db()

  const appointments = await db.collection("appointments").find().sort({ date: -1 }).toArray()

  // Fetch user and doctor details for each appointment
  const appointmentsWithDetails = await Promise.all(
    appointments.map(async (appointment) => {
      const [user, doctor] = await Promise.all([
        db.collection("users").findOne({ _id: appointment.userId }),
        db.collection("doctors").findOne({ _id: appointment.doctorId }),
      ])

      return {
        ...appointment,
        id: appointment._id.toString(),
        user: user
          ? {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
            }
          : null,
        doctor: doctor
          ? {
              id: doctor._id.toString(),
              name: doctor.name,
              specialty: doctor.specialty,
            }
          : null,
      }
    }),
  )

  return appointmentsWithDetails
}

// Seed data function
export async function seedDatabase() {
  const client = await clientPromise
  const db = client.db()

  // Check if admin user exists
  const adminExists = await db.collection("users").findOne({ role: "admin" })

  if (!adminExists) {
    // Create admin user (password will be hashed before insertion)
    await db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@example.com",
      password: "$2a$12$kHza1Ry5YsSFoSw.z3ZvQO9RVKl.Xj.8o4KH.L4GZ1XcEBQFe.YEa", // "admin123" hashed
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  // Check if doctors collection has data
  const doctorsCount = await db.collection("doctors").countDocuments()

  if (doctorsCount === 0) {
    // Create sample doctors
    await db.collection("doctors").insertMany([
      {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology, heart failure management, and cardiac imaging.",
        imageUrl: "/placeholder.svg?height=400&width=400&text=Dr.+Johnson",
        availability: [
          { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Wednesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Thursday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Neurology",
        bio: "Dr. Michael Chen is a neurologist specializing in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. He has particular expertise in headache management and stroke prevention.",
        imageUrl: "/placeholder.svg?height=400&width=400&text=Dr.+Chen",
        availability: [
          { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Wednesday", slots: [] },
          { day: "Thursday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        bio: "Dr. Emily Rodriguez is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from birth through adolescence. She focuses on preventive care, developmental milestones, and managing childhood illnesses.",
        imageUrl: "/placeholder.svg?height=400&width=400&text=Dr.+Rodriguez",
        availability: [
          { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Wednesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Thursday", slots: [] },
          { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. James Wilson",
        specialty: "Orthopedics",
        bio: "Dr. James Wilson is an orthopedic surgeon specializing in the diagnosis and treatment of disorders of the bones, joints, ligaments, tendons, and muscles. He has expertise in sports medicine, joint replacement, and minimally invasive procedures.",
        imageUrl: "/placeholder.svg?height=400&width=400&text=Dr.+Wilson",
        availability: [
          { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Wednesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Thursday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Lisa Thompson",
        specialty: "Dermatology",
        bio: "Dr. Lisa Thompson is a board-certified dermatologist specializing in the diagnosis and treatment of skin, hair, and nail conditions. She has expertise in medical dermatology, cosmetic procedures, and skin cancer detection and treatment.",
        imageUrl: "/placeholder.svg?height=400&width=400&text=Dr.+Thompson",
        availability: [
          { day: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Wednesday", slots: [] },
          { day: "Thursday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
          { day: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }

  return { success: true }
}
