// This file is the ONLY place that should import MongoDB directly
import "server-only"
import { MongoClient, ObjectId } from "mongodb"

// Singleton pattern for MongoDB connection
let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Safely serialize MongoDB objects
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

// Database operations
export async function findOne(collection, query) {
  const client = await clientPromise
  const db = client.db()
  const result = await db.collection(collection).findOne(query)
  return serializeData(result)
}

export async function find(collection, query = {}, options = {}) {
  const client = await clientPromise
  const db = client.db()
  const cursor = db.collection(collection).find(query)

  if (options.sort) {
    cursor.sort(options.sort)
  }

  const results = await cursor.toArray()
  return serializeData(results)
}

export async function insertOne(collection, document) {
  const client = await clientPromise
  const db = client.db()
  const result = await db.collection(collection).insertOne({
    ...document,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return { id: result.insertedId.toString(), ...document }
}

export async function updateOne(collection, id, update) {
  const client = await clientPromise
  const db = client.db()
  const result = await db.collection(collection).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    },
  )
  return result.modifiedCount > 0
}

export async function deleteOne(collection, id) {
  const client = await clientPromise
  const db = client.db()
  const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

// Helper to convert string IDs to ObjectId
export function createObjectId(id) {
  return new ObjectId(id)
}
