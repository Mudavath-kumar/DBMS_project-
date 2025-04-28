"use server"

import "server-only"
import { cookies } from "next/headers"
import * as serverDb from "./server-db"

export async function hashPassword(password: string) {
  return await serverDb.hashPassword(password)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await serverDb.verifyPassword(password, hashedPassword)
}

export async function createToken(user: { id: string; email: string; role: string }) {
  return await serverDb.createToken(user)
}

export async function verifyToken(token: string) {
  return await serverDb.verifyToken(token)
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

  const user = await serverDb.getUserById(session.id)

  if (!user) {
    return null
  }

  return {
    ...user,
    password: undefined,
  }
}
