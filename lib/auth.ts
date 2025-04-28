"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { compare, hash } from "bcryptjs"
import * as dataFetcher from "@/lib/data-fetcher"

// Create a secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-development")

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function createToken(user: { id: string; email: string; role: string }) {
  const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey)

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as { id: string; email: string; role: string }
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

  const user = await dataFetcher.getUserById(session.id)

  if (!user) {
    return null
  }

  return {
    ...user,
    password: undefined,
  }
}
