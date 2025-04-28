"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardCalendar({ appointments }) {
  const [date, setDate] = useState(new Date())

  // Get appointments for the selected date
  const appointmentsForDate = date
    ? appointments.filter((app) => {
        const appDate = new Date(app.date)
        return (
          appDate.getDate() === date.getDate() &&
          appDate.getMonth() === date.getMonth() &&
          appDate.getFullYear() === date.getFullYear()
        )
      })
    : []

  // Function to highlight dates with appointments
  const isDayWithAppointment = (day) => {
    return appointments.some((app) => {
      const appDate = new Date(app.date)
      return (
        appDate.getDate() === day.getDate() &&
        appDate.getMonth() === day.getMonth() &&
        appDate.getFullYear() === day.getFullYear()
      )
    })
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          appointment: (date) => isDayWithAppointment(date),
        }}
        modifiersClassNames={{
          appointment: "bg-primary/10 font-bold text-primary",
        }}
      />
      <div className="mt-6 space-y-2">
        <h4 className="font-medium">Appointments on {date ? format(date, "MMMM d, yyyy") : "selected date"}</h4>
        {appointmentsForDate.length > 0 ? (
          <div className="space-y-2">
            {appointmentsForDate.map((appointment) => (
              <Card key={appointment.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{appointment.doctor?.name || "Doctor"}</p>
                    <p className="text-sm text-muted-foreground">{appointment.doctor?.specialty || "Specialist"}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                  </div>
                  <Link href={`/appointments/${appointment.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border rounded-md p-4 text-center text-muted-foreground">
            No appointments scheduled for this day.
          </div>
        )}
      </div>
    </div>
  )
}
