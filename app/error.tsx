"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-4xl font-serif font-bold mb-4 text-brown-900">Something went wrong</h1>
      <p className="text-xl text-brown-600 mb-8 max-w-md">
        We apologize for the inconvenience. An error occurred while processing your request.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-brown-600 hover:bg-brown-700">
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
