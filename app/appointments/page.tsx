import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByUserId } from "@/lib/db-utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Plus, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CancelAppointmentButton from "./cancel-appointment-button"

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please log in to view your appointments.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  const appointments = await getAppointmentsByUserId(user._id)

  const upcomingAppointments = appointments.filter(
    (app: any) => new Date(app.date) >= new Date() && app.status !== "cancelled",
  )

  const pastAppointments = appointments.filter(
    (app: any) => new Date(app.date) < new Date() || app.status === "cancelled",
  )

  const showSuccess = searchParams.success === "true"

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground">Manage your upcoming and past appointments</p>
          </div>
          <Link href="/doctors">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {showSuccess && (
          <Alert className="border-green-500 text-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Appointment booked successfully!</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4 pt-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment: any) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isUpcoming={true} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                <Link href="/doctors">
                  <Button>Book an Appointment</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="space-y-4 pt-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment: any) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isUpcoming={false} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">You don't have any past appointments</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function AppointmentCard({ appointment, isUpcoming }: { appointment: any; isUpcoming: boolean }) {
  const doctor = appointment.doctor || {
    name: "Doctor",
    specialty: "Specialist",
    imageUrl: "/placeholder.svg?height=40&width=40",
  }

  const formattedDate = format(new Date(appointment.date), "EEEE, MMMM d, yyyy")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
            <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
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
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Medical Center</span>
              </div>
            </div>
            {appointment.reason && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Reason for Visit:</p>
                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              {isUpcoming && (
                <>
                  <Link href={`/appointments/${appointment.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <CancelAppointmentButton appointmentId={appointment.id} />
                </>
              )}
              {!isUpcoming && appointment.status === "completed" && (
                <>
                  <Link href={`/appointments/${appointment.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/doctors/${appointment.doctor.id}`}>
                    <Button size="sm">Book Again</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
