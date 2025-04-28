// This file should NEVER be imported directly from client components
import "server-only"
import { markAsServerOnly } from "../server-only-marker"
// Mark this module as server-only
markAsServerOnly()

// Use dynamic import to ensure MongoDB is only loaded on the server
let MongoClient, ObjectId

// This function will be called only on the server
async function loadMongoDBDependencies() {
  try {
    const mongodb = await import("mongodb")
    MongoClient = mongodb.MongoClient
    ObjectId = mongodb.ObjectId
    return { MongoClient, ObjectId }
  } catch (error) {
    console.error("Failed to load MongoDB dependencies:", error)
    throw error
  }
}

// Initialize MongoDB client
async function initMongoClient() {
  const { MongoClient } = await loadMongoDBDependencies()

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  const uri = process.env.MONGODB_URI
  const options = {}

  let client
  let clientPromise

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

// Export a function to get the MongoDB client
export async function getMongoClient() {
  return await initMongoClient()
}

// Export a function to create ObjectId
export async function createObjectId(id) {
  const { ObjectId } = await loadMongoDBDependencies()
  return new ObjectId(id)
}

// Helper function to serialize MongoDB objects
export async function serializeData(data) {
  const { ObjectId } = await loadMongoDBDependencies()

  if (!data) return null

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => serializeData(item)))
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
        serialized[key] = await serializeData(value)
      }
    }
    return serialized
  }

  return data
}
