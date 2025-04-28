import { getAllDoctors } from "@/lib/db-utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Clock } from "lucide-react"
import DoctorsFilter from "./doctors-filter"

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { specialty?: string; search?: string }
}) {
  const doctors = await getAllDoctors({
    specialty: searchParams.specialty,
    search: searchParams.search,
  })

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
          <p className="text-muted-foreground">Browse our network of trusted healthcare professionals</p>
        </div>
      </div>

      {/* Search and Filter */}
      <DoctorsFilter />

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {doctors.length > 0 ? (
          doctors.map((doctor: any) => (
            <Card key={doctor.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-primary text-sm">{doctor.specialty}</p>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">4.9</span>
                  </div>
                  <span className="text-muted-foreground text-sm ml-2">(48 reviews)</span>
                </div>
                <div className="flex flex-col space-y-2 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Medical Center</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Available Today</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/doctors/${doctor.id}`}>Book Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No doctors found. Please try a different search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
