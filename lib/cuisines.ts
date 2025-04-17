"use server"

import clientPromise from "./mongodb"
import type { Cuisine } from "./types"

// Get all cuisines
export async function getAllCuisines(): Promise<Cuisine[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("cuisines")

  const cuisines = await collection.find({}).sort({ name: 1 }).toArray()
  return cuisines as Cuisine[]
}

// Get cuisine by slug
export async function getCuisineBySlug(slug: string): Promise<Cuisine | null> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("cuisines")

  const cuisine = await collection.findOne({ slug })
  return cuisine as Cuisine
}

// Initialize default cuisines if none exist
export async function initializeCuisines() {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("cuisines")

  const count = await collection.countDocuments()
  if (count === 0) {
    const defaultCuisines: Omit<Cuisine, "_id">[] = [
      {
        name: "Italian",
        slug: "italian",
        description: "Classic Italian dishes from pasta to pizza",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Indian",
        slug: "indian",
        description: "Flavorful and spicy Indian cuisine",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Mexican",
        slug: "mexican",
        description: "Vibrant and bold Mexican flavors",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Chinese",
        slug: "chinese",
        description: "Traditional and modern Chinese recipes",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Japanese",
        slug: "japanese",
        description: "Elegant and precise Japanese cooking",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Mediterranean",
        slug: "mediterranean",
        description: "Healthy and flavorful Mediterranean dishes",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "American",
        slug: "american",
        description: "Classic American comfort food",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Thai",
        slug: "thai",
        description: "Aromatic and spicy Thai cuisine",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
    ]

    await collection.insertMany(defaultCuisines)
  }
}
