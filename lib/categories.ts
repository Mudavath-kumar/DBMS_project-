"use server"

import clientPromise from "./mongodb"
import type { Category } from "./types"

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("categories")

  const categories = await collection.find({}).sort({ name: 1 }).toArray()
  return categories as Category[]
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("categories")

  const category = await collection.findOne({ slug })
  return category as Category
}

// Initialize default categories if none exist
export async function initializeCategories() {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("categories")

  const count = await collection.countDocuments()
  if (count === 0) {
    const defaultCategories: Omit<Category, "_id">[] = [
      {
        name: "Breakfast",
        slug: "breakfast",
        description: "Start your day with these delicious breakfast recipes",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Lunch",
        slug: "lunch",
        description: "Perfect meals for your midday break",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Dinner",
        slug: "dinner",
        description: "Hearty and satisfying dinner recipes for the whole family",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Desserts",
        slug: "desserts",
        description: "Sweet treats to satisfy your cravings",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Snacks",
        slug: "snacks",
        description: "Quick and easy snack ideas",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
      {
        name: "Drinks",
        slug: "drinks",
        description: "Refreshing beverages for any occasion",
        imageUrl: "/placeholder.svg?height=300&width=400",
      },
    ]

    await collection.insertMany(defaultCategories)
  }
}
