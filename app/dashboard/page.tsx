import { getUserData, getUserAppointments } from "@/app/actions/data-fetching"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Clock, FileText, User, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import DashboardCalendar from "./dashboard-calendar"

export default async function DashboardPage() {
  const user = await getUserData()

  if (!user) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-6">Please log in to view your dashboard.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  const appointments = await getUserAppointments()

  const upcomingAppointments = appointments.filter(
    (app: any) => new Date(app.date) >= new Date() && app.status !== "cancelled",
  )

  const pendingAppointments = appointments.filter((app: any) => app.status === "pending")

  const completedAppointments = appointments.filter((app: any) => app.status === "completed")

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <CalendarClock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <h3 className="text-2xl font-bold">{upcomingAppointments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold">{completedAppointments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">{pendingAppointments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile</p>
                <h3 className="text-2xl font-bold">Complete</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <Button asChild>
                <Link href="/doctors">Book New Appointment</Link>
              </Button>
            </div>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={appointment.doctor?.imageUrl || "/placeholder.svg"}
                            alt={appointment.doctor?.name || "Doctor"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{appointment.doctor?.name || "Doctor"}</h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.specialty || "Specialist"}
                              </p>
                            </div>
                            <Badge
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : appointment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : ""
                              }
                            >
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link href={`/appointments/${appointment.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-500">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

            <TabsContent value="past" className="space-y-4">
              {appointments.filter((app: any) => new Date(app.date) < new Date() || app.status === "cancelled").length >
              0 ? (
                appointments
                  .filter((app: any) => new Date(app.date) < new Date() || app.status === "cancelled")
                  .map((appointment: any) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={appointment.doctor?.imageUrl || "/placeholder.svg"}
                              alt={appointment.doctor?.name || "Doctor"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{appointment.doctor?.name || "Doctor"}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.doctor?.specialty || "Specialist"}
                                </p>
                              </div>
                              <Badge
                                className={
                                  appointment.status === "completed"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : appointment.status === "cancelled"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : ""
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Link href={`/appointments/${appointment.id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                              {appointment.status === "completed" && (
                                <Link href={`/doctors/${appointment.doctor?.id}`}>
                                  <Button size="sm">Book Again</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">You don't have any past appointments</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={appointment.doctor?.imageUrl || "/placeholder.svg"}
                            alt={appointment.doctor?.name || "Doctor"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold">{appointment.doctor?.name || "Doctor"}</h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor?.specialty || "Specialist"}
                              </p>
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
                              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{format(new Date(appointment.date), "MMMM d, yyyy")}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You don't have any appointments</p>
                  <Link href="/doctors">
                    <Button>Book an Appointment</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardCalendar appointments={appointments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
