// This file is safe to import from client components
// It doesn't import any server-only modules

export async function fetchData(operation: string, params: any = {}) {
  try {
    const response = await fetch("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, params }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch data")
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error(`Error fetching data for operation ${operation}:`, error)
    throw error
  }
}

// User related functions
export async function getUserByEmail(email: string) {
  return await fetchData("getUserByEmail", { email })
}

export async function getUserById(id: string) {
  return await fetchData("getUserById", { id })
}

// Doctor related functions
export async function getAllDoctors(filters: any = {}) {
  return await fetchData("getAllDoctors", filters)
}

export async function getDoctorById(id: string) {
  return await fetchData("getDoctorById", { id })
}

// Appointment related functions
export async function getUserAppointments() {
  return await fetchData("getUserAppointments")
}

export async function getAppointmentById(id: string) {
  return await fetchData("getAppointmentById", { id })
}

export async function createAppointment(appointmentData: any) {
  return await fetchData("createAppointment", appointmentData)
}

export async function updateAppointment(id: string, data: any) {
  return await fetchData("updateAppointment", { id, data })
}
