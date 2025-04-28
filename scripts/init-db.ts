import { MongoClient } from "mongodb"
import { hash } from "bcryptjs"

async function main() {
  // Connect to MongoDB
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()

    // Create admin user
    const adminPassword = await hash("admin123", 12)
    await db.collection("users").insertOne({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log("Admin user created")

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
    console.log("Sample doctors created")

    console.log("Database initialization complete")
  } finally {
    await client.close()
    console.log("MongoDB connection closed")
  }
}

main().catch(console.error)
