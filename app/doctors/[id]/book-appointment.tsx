"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CalendarIcon, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface BookAppointmentProps {
  doctorId: string
  availability: {
    day: string
    slots: string[]
  }[]
}

export default function BookAppointment({ doctorId, availability }: BookAppointmentProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Get day of week from selected date
  const dayOfWeek = date ? format(date, "EEEE") : ""

  // Get available time slots for selected day
  const availableSlots = availability.find((a) => a.day === dayOfWeek)?.slots || []

  const handleBookAppointment = async () => {
    if (!date || !selectedTime) {
      setError("Please select both date and time")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId,
          date: date.toISOString(),
          time: selectedTime,
          reason,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to book appointment")
      }

      // Redirect to appointments page
      router.push("/appointments?success=true")
    } catch (err: any) {
      setError(err.message || "An error occurred while booking the appointment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="font-semibold mb-2 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Select Date
          </h4>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates
              const today = new Date()
              today.setHours(0, 0, 0, 0)

              if (date < today) return true

              // Disable days with no availability
              const day = format(date, "EEEE")
              const dayAvailability = availability.find((a) => a.day === day)
              return !dayAvailability || dayAvailability.slots.length === 0
            }}
          />
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Select Time
          </h4>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  className="text-sm"
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No available slots for the selected date. Please choose another date.
            </p>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Reason for Visit (Optional)</h4>
          <Textarea
            placeholder="Briefly describe your symptoms or reason for the appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <Button className="w-full" onClick={handleBookAppointment} disabled={!date || !selectedTime || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
