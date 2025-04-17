"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import clientPromise from "./mongodb"
import type { User } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("users")

  // Check if user already exists
  const existingUser = await collection.findOne({ email })
  if (existingUser) {
    return null
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const newUser: Omit<User, "_id"> = {
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    favorites: [],
  }

  const result = await collection.insertOne(newUser)

  return {
    _id: result.insertedId,
    ...newUser,
  }
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("users")

  // Find user
  const user = await collection.findOne({ email })
  if (!user) {
    return null
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }

  // Create token
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" })

  // Set cookie
  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return user as User
}

export async function logoutUser() {
  cookies().delete("auth-token")
  redirect("/")
}

export async function getCurrentUser(): Promise<User | null> {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("users")

    const user = await collection.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return null
    }

    return user as User
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function addToFavorites(userId: string, recipeId: string) {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("users")

  await collection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { favorites: recipeId } })
}

export async function removeFromFavorites(userId: string, recipeId: string) {
  const client = await clientPromise
  const collection = client.db("recipe-app").collection("users")

  await collection.updateOne({ _id: new ObjectId(userId) }, { $pull: { favorites: recipeId } })
}

export async function getFavoriteRecipes(userId: string) {
  const client = await clientPromise
  const usersCollection = client.db("recipe-app").collection("users")
  const recipesCollection = client.db("recipe-app").collection("recipes")

  const user = (await usersCollection.findOne({ _id: new ObjectId(userId) })) as User
  if (!user || !user.favorites.length) {
    return []
  }

  const favoriteIds = user.favorites.map((id) => new ObjectId(id))
  const recipes = await recipesCollection.find({ _id: { $in: favoriteIds } }).toArray()

  return recipes
}
