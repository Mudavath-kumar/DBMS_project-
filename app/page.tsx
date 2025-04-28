import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarCheck, Clock, UserCheck, Shield, Award, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Medical background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Health, <span className="text-primary">Our Priority</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Book appointments with top healthcare professionals in your area. Fast, secure, and convenient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/doctors">Find a Doctor</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">500+</span>
                  <span className="text-muted-foreground">Doctors</span>
                </div>
                <div className="h-10 border-l"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">10k+</span>
                  <span className="text-muted-foreground">Patients</span>
                </div>
                <div className="h-10 border-l"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">20+</span>
                  <span className="text-muted-foreground">Specialties</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=1000&width=800"
                alt="Doctor with patient"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose HealthBook?</h2>
            <p className="text-muted-foreground text-lg">
              We provide a seamless healthcare experience with features designed to make your life easier.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
                  <p className="text-muted-foreground">
                    Book appointments with just a few clicks, 24/7, from anywhere.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                  <p className="text-muted-foreground">
                    No more waiting on hold or standing in line. Manage your appointments online.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Verified Doctors</h3>
                  <p className="text-muted-foreground">
                    All healthcare providers on our platform are verified and qualified.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your health information is protected with industry-leading security.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Top Specialists</h3>
                  <p className="text-muted-foreground">
                    Access to the best specialists across multiple medical fields.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Patient-Centered</h3>
                  <p className="text-muted-foreground">
                    We prioritize your needs and preferences for a better healthcare experience.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Featured Doctors</h2>
              <p className="text-muted-foreground">Meet some of our top healthcare professionals</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link href="/doctors">View All Doctors</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((doctor) => (
              <Card key={doctor} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={`/placeholder.svg?height=400&width=400&text=Doctor+${doctor}`}
                    alt={`Doctor ${doctor}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                  <p className="text-primary text-sm mb-2">Cardiologist</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Specializing in cardiovascular health with over 10 years of experience.
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/doctors/${doctor}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to prioritize your health?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of patients who trust HealthBook for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Create an Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/doctors">Find a Doctor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
