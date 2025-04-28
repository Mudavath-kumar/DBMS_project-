"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import * as dataFetcher from "@/lib/data-fetcher"

export default function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    setIsLoading(true)

    try {
      await dataFetcher.updateAppointment(appointmentId, {
        status: "cancelled",
      })

      router.refresh()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      alert("Failed to cancel appointment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-red-500 hover:text-red-500"
      onClick={handleCancel}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
    </Button>
  )
}
