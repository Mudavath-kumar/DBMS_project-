"use server"

import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { getCurrentUser } from "./auth"
import type { Recipe, RecipeInput, Rating } from "./types"

// Get all recipes
export async function getAllRecipes(): Promise<Recipe[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipes = await collection.find({}).sort({ createdAt: -1 }).toArray()

  return recipes as Recipe[]
}

// Get all recipes with pagination and filters
export async function getRecipes({
  page = 1,
  limit = 12,
  category = "",
  cuisine = "",
  dietary = "",
  search = "",
}: {
  page?: number
  limit?: number
  category?: string
  cuisine?: string
  dietary?: string
  search?: string
}): Promise<{ recipes: Recipe[]; total: number }> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const skip = (page - 1) * limit

  // Build query
  const query: any = {}
  if (category) query.category = category
  if (cuisine) query.cuisine = cuisine
  if (dietary) query.dietary = dietary
  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
  }

  const total = await collection.countDocuments(query)
  const recipes = await collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

  return { recipes: recipes as Recipe[], total }
}

// Get newly added recipes
export async function getNewlyAddedRecipes(limit = 6): Promise<Recipe[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipes = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()

  return recipes as Recipe[]
}

// Get popular recipes
export async function getPopularRecipes(limit = 6): Promise<Recipe[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipes = await collection.find({}).sort({ averageRating: -1 }).limit(limit).toArray()

  return recipes as Recipe[]
}

// Get a recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  try {
    const recipe = await collection.findOne({ _id: new ObjectId(id) })
    return recipe as Recipe
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return null
  }
}

// Create a new recipe
export async function createRecipe(recipeData: RecipeInput): Promise<Recipe | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const newRecipe = {
    ...recipeData,
    authorId: user._id?.toString(),
    authorName: user.name,
    createdAt: new Date(),
    ratings: [],
    averageRating: 0,
  }

  const result = await collection.insertOne(newRecipe)

  return {
    _id: result.insertedId,
    ...newRecipe,
  } as Recipe
}

// Update a recipe
export async function updateRecipe(id: string, recipeData: RecipeInput): Promise<Recipe | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipe = await collection.findOne({ _id: new ObjectId(id) })
  if (!recipe || recipe.authorId !== user._id?.toString()) {
    return null
  }

  try {
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: recipeData })

    return {
      _id: new ObjectId(id),
      ...recipe,
      ...recipeData,
    } as Recipe
  } catch (error) {
    console.error("Error updating recipe:", error)
    return null
  }
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipe = await collection.findOne({ _id: new ObjectId(id) })
  if (!recipe || recipe.authorId !== user._id?.toString()) {
    return false
  }

  try {
    await collection.deleteOne({ _id: new ObjectId(id) })
    return true
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return false
  }
}

// Rate a recipe
export async function rateRecipe(recipeId: string, rating: number, comment?: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipe = (await collection.findOne({ _id: new ObjectId(recipeId) })) as Recipe
  if (!recipe) {
    return false
  }

  // Check if user already rated
  const existingRatingIndex = recipe.ratings.findIndex((r) => r.userId === user._id?.toString())

  const newRatings = [...recipe.ratings]
  const newRating: Rating = {
    userId: user._id?.toString() || "",
    value: rating,
    comment,
    createdAt: new Date(),
  }

  if (existingRatingIndex >= 0) {
    // Update existing rating
    newRatings[existingRatingIndex] = newRating
  } else {
    // Add new rating
    newRatings.push(newRating)
  }

  // Calculate average rating
  const averageRating = newRatings.reduce((sum, r) => sum + r.value, 0) / newRatings.length

  try {
    await collection.updateOne({ _id: new ObjectId(recipeId) }, { $set: { ratings: newRatings, averageRating } })
    return true
  } catch (error) {
    console.error("Error rating recipe:", error)
    return false
  }
}

// Get user recipes
export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("recipes")

  const recipes = await collection.find({ authorId: userId }).sort({ createdAt: -1 }).toArray()

  return recipes as Recipe[]
}
