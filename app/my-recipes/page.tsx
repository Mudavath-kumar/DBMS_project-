import Link from "next/link"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { requireAuth } from "@/lib/auth"
import { getUserRecipes } from "@/lib/recipes"
import { RatingStars } from "@/components/rating-stars"

export default async function MyRecipesPage() {
  const user = await requireAuth()
  const recipes = await getUserRecipes(user._id?.toString() || "")

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brown-900">My Recipes</h1>
          <p className="text-brown-600">Manage your recipe collection</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600">
          <Link href="/recipes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Recipe
          </Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">You haven't added any recipes yet</h2>
          <p className="text-gray-600 mb-6">Share your culinary creations with the world!</p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600">
            <Link href="/recipes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Recipe
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
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
                    <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <RatingStars rating={recipe.averageRating} size="sm" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
