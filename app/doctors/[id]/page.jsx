import { getDoctor, getCurrentUser } from "@/app/actions/server-actions"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, Mail, ThumbsUp, BookOpen } from "lucide-react"
import BookAppointment from "./book-appointment"

export default async function DoctorDetailPage({ params }) {
  const [doctor, user] = await Promise.all([getDoctor(params.id), getCurrentUser()])

  if (!doctor) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Doctor Not Found</h1>
        <p className="mb-6">The doctor you are looking for does not exist or has been removed.</p>
        <Link href="/doctors">
          <Button>Back to Doctors</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Profile */}
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
              <Image src={doctor.imageUrl || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-primary text-lg mb-3">{doctor.specialty}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">4.9</span>
                </div>
                <span className="text-muted-foreground ml-2">(48 reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">English</Badge>
                <Badge variant="outline">Spanish</Badge>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground mb-2">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>123 Medical Center Dr, Healthcare City, HC 12345</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Phone className="h-5 w-5" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>dr.{doctor.name.split(" ")[1].toLowerCase()}@healthbook.com</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education & Experience</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About Dr. {doctor.name.split(" ")[1]}</h3>
                <p>{doctor.bio}</p>
                <h3 className="text-xl font-semibold mt-6 mb-4">Specializations</h3>
                <ul>
                  <li>Preventive Cardiology</li>
                  <li>Heart Failure Management</li>
                  <li>Cardiac Imaging</li>
                  <li>Coronary Artery Disease</li>
                  <li>Hypertension Management</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="education" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {[
                      { degree: "MD", institution: "Harvard Medical School", year: "2005" },
                      { degree: "Residency", institution: "Massachusetts General Hospital", year: "2009" },
                      { degree: "Fellowship", institution: "Cleveland Clinic", year: "2012" },
                    ].map((edu, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-muted-foreground">
                            {edu.institution}, {edu.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                  <div className="space-y-2">
                    {[
                      "American Board of Internal Medicine - Cardiovascular Disease",
                      "Advanced Cardiac Life Support (ACLS)",
                      "Fellow of the American College of Cardiology (FACC)",
                    ].map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <ThumbsUp className="h-5 w-5 text-primary shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Patient Reviews</h3>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-6 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold">John D.</div>
                        <div className="text-sm text-muted-foreground">2 weeks ago</div>
                      </div>
                      <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        Dr. {doctor.name.split(" ")[1]} was very thorough and took the time to explain everything to me.
                        {review === 1 && " She answered all my questions and made me feel at ease. Highly recommend!"}
                        {review === 2 &&
                          " I've been seeing Dr. Johnson for years and she has always provided excellent care."}
                        {review === 3 &&
                          " After my heart attack, Dr. Johnson helped me recover and develop a heart-healthy lifestyle."}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Appointment Booking */}
        <div>
          {user ? (
            <BookAppointment doctorId={doctor.id} availability={doctor.availability} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Book an Appointment</h3>
                <p className="mb-6 text-muted-foreground">
                  Please log in or create an account to book an appointment with Dr. {doctor.name.split(" ")[1]}.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
              <div className="space-y-2">
                {doctor.availability.map((day, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">
                      {day.slots.length > 0 ? `${day.slots[0]} - ${day.slots[day.slots.length - 1]}` : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
