import { getCurrentUser } from "@/lib/auth"
import { getAppointmentById } from "@/lib/db-utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, FileText, ArrowLeft, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import CancelAppointmentButton from "./cancel-button"

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please log in to view appointment details.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  const appointment = await getAppointmentById(params.id)

  if (!appointment) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Appointment Not Found</h1>
        <p className="mb-6">The appointment you are looking for does not exist or has been removed.</p>
        <Link href="/appointments">
          <Button>Back to Appointments</Button>
        </Link>
      </div>
    )
  }

  // Check if appointment belongs to user
  if (appointment.userId.toString() !== user._id && user.role !== "admin") {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="mb-6">You do not have permission to view this appointment.</p>
        <Link href="/appointments">
          <Button>Back to Appointments</Button>
        </Link>
      </div>
    )
  }

  const doctor = appointment.doctor || {
    name: "Doctor",
    specialty: "Specialist",
    imageUrl: "/placeholder.svg?height=200&width=200",
  }

  const formattedDate = format(new Date(appointment.date), "EEEE, MMMM d, yyyy")
  const isUpcoming = new Date(appointment.date) >= new Date() && appointment.status !== "cancelled"

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/appointments" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Appointment Details</CardTitle>
              <Badge
                className={
                  appointment.status === "confirmed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0">
                  <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{doctor.name}</h2>
                  <p className="text-primary">{doctor.specialty}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Medical Center, Room 305</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>Appointment #{appointment.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {appointment.reason && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Reason for Visit</h3>
                  <div className="p-4 bg-muted rounded-md">
                    <p>{appointment.reason}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Appointment Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <p className="font-medium">Appointment Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">Appointment Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {appointment.status === "cancelled" && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-red-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">Appointment Cancelled</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}

                  {appointment.status === "completed" && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">Appointment Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isUpcoming && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline">Reschedule</Button>
                  <CancelAppointmentButton appointmentId={appointment.id} />
                </div>
              )}

              {appointment.status === "completed" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Link href={`/doctors/${doctor.id}`}>
                    <Button>Book Again</Button>
                  </Link>
                  <Button variant="outline">Leave Review</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  Dr. {doctor.name.split(" ")[1]} is a board-certified specialist with extensive experience in treating
                  various conditions.
                </p>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Medical Center, Healthcare City</span>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">(555) 123-4567</span>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">dr.{doctor.name.split(" ")[1].toLowerCase()}@healthbook.com</span>
                </div>
              </div>

              <Link href={`/doctors/${doctor.id}`} className="block mt-4">
                <Button variant="outline" className="w-full">
                  View Doctor Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you need to make changes to your appointment or have any questions, please contact our support team.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
