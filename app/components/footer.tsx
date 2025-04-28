import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">HealthBook</h3>
            <p className="text-muted-foreground mb-4">
              Your trusted platform for booking medical appointments online. We connect patients with healthcare
              providers for a seamless healthcare experience.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-muted-foreground hover:text-primary">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/general-checkup" className="text-muted-foreground hover:text-primary">
                  General Checkup
                </Link>
              </li>
              <li>
                <Link href="/services/cardiology" className="text-muted-foreground hover:text-primary">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="/services/neurology" className="text-muted-foreground hover:text-primary">
                  Neurology
                </Link>
              </li>
              <li>
                <Link href="/services/pediatrics" className="text-muted-foreground hover:text-primary">
                  Pediatrics
                </Link>
              </li>
              <li>
                <Link href="/services/orthopedics" className="text-muted-foreground hover:text-primary">
                  Orthopedics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">123 Medical Center Dr, Healthcare City, HC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">contact@healthbook.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
