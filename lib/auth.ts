"use server"

import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function createToken(user: { _id: ObjectId; email: string; role: string }) {
  const token = sign({ id: user._id.toString(), email: user.email, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  })

  return token
}

export async function verifyToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      role: string
    }
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  const decoded = await verifyToken(token)
  if (!decoded) {
    return null
  }

  return decoded
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ _id: new ObjectId(session.id) })

  if (!user) {
    return null
  }

  return {
    ...user,
    _id: user._id.toString(),
    password: undefined,
  }
}
