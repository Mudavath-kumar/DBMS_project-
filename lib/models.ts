import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "user" | "admin" | "doctor"
  createdAt: Date
  updatedAt: Date
}

export interface Doctor {
  _id?: ObjectId
  name: string
  specialty: string
  bio: string
  imageUrl: string
  availability: {
    day: string
    slots: string[]
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  _id?: ObjectId
  userId: ObjectId
  doctorId: ObjectId
  date: Date
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  reason: string
  createdAt: Date
  updatedAt: Date
}
