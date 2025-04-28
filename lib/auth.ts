"use server"

import "server-only"
import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import * as db from "./mongodb-isolation"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function createToken(user: { id: string; email: string; role: string }) {
  const token = sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" })

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

  const user = await db.findOne("users", { _id: db.createObjectId(session.id) })

  if (!user) {
    return null
  }

  return {
    ...user,
    password: undefined,
  }
}
