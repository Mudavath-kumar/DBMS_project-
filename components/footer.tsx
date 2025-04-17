import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-brown-50">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">RecipeHaven</h3>
            <p className="text-muted-foreground mb-4">
              Discover your next favorite recipe from our curated collection of delicious dishes from around the world.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Recipe Categories
                </Link>
              </li>
              <li>
                <Link href="/cuisines" className="text-muted-foreground hover:text-primary">
                  Cuisines
                </Link>
              </li>
              <li>
                <Link href="/explore/popular" className="text-muted-foreground hover:text-primary">
                  Popular Recipes
                </Link>
              </li>
              <li>
                <Link href="/explore/recent" className="text-muted-foreground hover:text-primary">
                  Recently Added
                </Link>
              </li>
              <li>
                <Link href="/explore/seasonal" className="text-muted-foreground hover:text-primary">
                  Seasonal Recipes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Dietary</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dietary/vegetarian" className="text-muted-foreground hover:text-primary">
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link href="/dietary/vegan" className="text-muted-foreground hover:text-primary">
                  Vegan
                </Link>
              </li>
              <li>
                <Link href="/dietary/gluten-free" className="text-muted-foreground hover:text-primary">
                  Gluten-Free
                </Link>
              </li>
              <li>
                <Link href="/dietary/dairy-free" className="text-muted-foreground hover:text-primary">
                  Dairy-Free
                </Link>
              </li>
              <li>
                <Link href="/dietary/keto" className="text-muted-foreground hover:text-primary">
                  Keto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-primary">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/my-recipes" className="text-muted-foreground hover:text-primary">
                  My Recipes
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-primary">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} RecipeHaven. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
