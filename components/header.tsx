"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import type { Category, Cuisine, User as UserType } from "@/lib/types"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [cuisines, setCuisines] = useState<Cuisine[]>([])
  const [user, setUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesData, cuisinesData, userData] = await Promise.all([
        getAllCategories(),
        getAllCuisines(),
        getCurrentUser(),
      ])
      setCategories(categoriesData)
      setCuisines(cuisinesData)
      setUser(userData)
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const dietaryOptions = [
    { name: "Vegetarian", slug: "vegetarian" },
    { name: "Vegan", slug: "vegan" },
    { name: "Gluten-Free", slug: "gluten-free" },
    { name: "Dairy-Free", slug: "dairy-free" },
    { name: "Keto", slug: "keto" },
    { name: "Low-Carb", slug: "low-carb" },
  ]

  const exploreOptions = [
    { name: "Popular Recipes", slug: "popular" },
    { name: "Recently Added", slug: "recent" },
    { name: "Seasonal", slug: "seasonal" },
    { name: "Quick & Easy", slug: "quick-easy" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown-700">
            RecipeHaven
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Cuisines <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {cuisines.map((cuisine) => (
                  <DropdownMenuItem key={cuisine.slug} asChild>
                    <Link href={`/cuisines/${cuisine.slug}`}>{cuisine.name}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/cuisines">View All Cuisines</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Dietary <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {dietaryOptions.map((option) => (
                  <DropdownMenuItem key={option.slug} asChild>
                    <Link href={`/dietary/${option.slug}`}>{option.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Explore <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {exploreOptions.map((option) => (
                  <DropdownMenuItem key={option.slug} asChild>
                    <Link href={`/explore/${option.slug}`}>{option.name}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/categories">Recipe Categories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-64">
            <Input
              type="search"
              placeholder="Search recipes..."
              className="pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    <User className="h-4 w-4 mr-1" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-recipes">My Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">Favorites</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/new">Add Recipe</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <form action={logoutUser} className="w-full">
                      <button type="submit" className="w-full text-left">
                        Logout
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-brown-600 hover:bg-brown-700 text-white">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="flex relative">
              <Input
                type="search"
                placeholder="Search recipes..."
                className="pr-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-2">
              <h3 className="font-medium">Cuisines</h3>
              <div className="grid grid-cols-2 gap-2">
                {cuisines.slice(0, 6).map((cuisine) => (
                  <Link key={cuisine.slug} href={`/cuisines/${cuisine.slug}`} className="text-sm hover:underline">
                    {cuisine.name}
                  </Link>
                ))}
                <Link href="/cuisines" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Dietary</h3>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((option) => (
                  <Link key={option.slug} href={`/dietary/${option.slug}`} className="text-sm hover:underline">
                    {option.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Explore</h3>
              <div className="grid grid-cols-2 gap-2">
                {exploreOptions.map((option) => (
                  <Link key={option.slug} href={`/explore/${option.slug}`} className="text-sm hover:underline">
                    {option.name}
                  </Link>
                ))}
                <Link href="/categories" className="text-sm hover:underline">
                  Recipe Categories
                </Link>
              </div>
            </div>

            <div className="pt-2 border-t">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/profile" className="text-sm hover:underline">
                      My Profile
                    </Link>
                    <Link href="/my-recipes" className="text-sm hover:underline">
                      My Recipes
                    </Link>
                    <Link href="/favorites" className="text-sm hover:underline">
                      Favorites
                    </Link>
                    <Link href="/recipes/new" className="text-sm hover:underline">
                      Add Recipe
                    </Link>
                  </div>
                  <form action={logoutUser} className="pt-2">
                    <Button type="submit" variant="outline" className="w-full">
                      Logout
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-brown-600 hover:bg-brown-700 text-white">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
