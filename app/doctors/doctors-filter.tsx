"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Mock data for specialties
const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Ophthalmology",
  "Psychiatry",
  "Endocrinology",
]

export default function DoctorsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "All Specialties")

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams()

      if (search) {
        params.set("search", search)
      }

      if (specialty && specialty !== "All Specialties") {
        params.set("specialty", specialty)
      }

      router.push(`/doctors?${params.toString()}`)
    })
  }

  const handleReset = () => {
    setSearch("")
    setSpecialty("All Specialties")
    router.push("/doctors")
  }

  return (
    <div className="bg-muted/50 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search" className="mb-2 block">
            Search by name
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search doctors..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="specialty" className="mb-2 block">
            Specialty
          </Label>
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger id="specialty">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button className="flex-1" onClick={handleSearch} disabled={isPending}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={isPending}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
