import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChefHat, Clock, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getNewlyAddedRecipes, getPopularRecipes } from "@/lib/recipes"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import { initializeCategories } from "@/lib/categories"
import { initializeCuisines } from "@/lib/cuisines"

export default async function Home() {
  // Initialize default data if needed
  await Promise.all([initializeCategories(), initializeCuisines()])

  // Fetch data for the homepage
  const [newRecipes, popularRecipes, categories, cuisines] = await Promise.all([
    getNewlyAddedRecipes(6),
    getPopularRecipes(6),
    getAllCategories(),
    getAllCuisines(),
  ])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brown-50 py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-brown-900 mb-6">
              Discover Your
              <br />
              Next Favorite Recipe
            </h1>
            <p className="text-xl text-brown-600 mb-8">
              Explore our curated collection of delicious recipes from around the world
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-brown-600 hover:bg-brown-700 text-white">
                <Link href="/cuisines/indian">Browse Indian Recipes</Link>
              </Button>
              <Button asChild variant="outline" className="border-brown-200">
                <Link href="/videos">Watch Cooking Videos</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                <Link href="/recipes/new">
                  <Utensils className="mr-2 h-4 w-4" />
                  Add Your Recipe
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newly Added Recipes */}
      <section className="py-12 bg-amber-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-brown-900">Newly Added Recipes</h2>
              <p className="text-brown-600">Check out the latest culinary creations from our community</p>
            </div>
            <Link href="/explore/recent" className="text-brown-600 hover:text-brown-800 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newRecipes.map((recipe) => (
              <Link key={recipe._id?.toString()} href={`/recipes/${recipe._id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-orange-200 hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-brown-700 hover:bg-white">
                        {recipe.dietary.includes("vegetarian") ? "Vegetarian" : "Non-Vegetarian"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        {recipe.cuisine}
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        {recipe.category}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-brown-500" />
                      {recipe.cookingTime} mins
                    </div>
                    <div className="flex items-center">
                      <ChefHat className="mr-1 h-4 w-4 text-brown-500" />
                      {recipe.difficulty}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brown-900">Recipe Categories</h2>
            <p className="text-brown-600">Find recipes by meal type</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 text-center group">
                  <div className="relative h-36 w-full">
                    <Image
                      src={category.imageUrl || "/placeholder.svg?height=200&width=300"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <h3 className="font-medium text-lg text-white">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-12 bg-brown-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-brown-900">Popular Recipes</h2>
              <p className="text-brown-600">Our most loved recipes by the community</p>
            </div>
            <Link href="/explore/popular" className="text-brown-600 hover:text-brown-800 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularRecipes.map((recipe) => (
              <Link key={recipe._id?.toString()} href={`/recipes/${recipe._id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-orange-200 hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-brown-700 hover:bg-white">
                        {recipe.dietary.includes("vegetarian") ? "Vegetarian" : "Non-Vegetarian"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        {recipe.cuisine}
                      </Badge>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        {recipe.category}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-brown-500" />
                      {recipe.cookingTime} mins
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(recipe.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section className="py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brown-900">Explore Cuisines</h2>
            <p className="text-brown-600">Discover recipes from around the world</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cuisines.map((cuisine) => (
              <Link key={cuisine.slug} href={`/cuisines/${cuisine.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 text-center group">
                  <div className="relative h-48 w-full">
                    <Image
                      src={cuisine.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={cuisine.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <h3 className="font-medium text-xl text-white">{cuisine.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brown-600 to-brown-800 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Share Your Culinary Creations</h2>
            <p className="text-lg mb-8 text-brown-100">
              Join our community of food enthusiasts and share your favorite recipes with the world.
            </p>
            <Button asChild size="lg" className="bg-white text-brown-800 hover:bg-brown-100">
              <Link href="/recipes/new">
                <Utensils className="mr-2 h-5 w-5" />
                Add Your Recipe
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
