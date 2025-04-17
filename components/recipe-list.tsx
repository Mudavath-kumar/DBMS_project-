import Link from "next/link"
import { Clock, Utensils } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllRecipes } from "@/lib/recipes"
import { Badge } from "@/components/ui/badge"

export async function RecipeList() {
  const recipes = await getAllRecipes()

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-amber-50 rounded-lg">
        <div className="bg-white p-3 rounded-full mb-4 shadow-sm">
          <Utensils className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Your culinary journey starts with adding your first recipe. It only takes a minute!
        </p>
        <Link href="/recipes/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Recipe
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe._id.toString()} href={`/recipes/${recipe._id}`}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-orange-200 hover:-translate-y-1">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 h-3" />
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1 text-gray-900">{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    {ingredient.split(" ").slice(-1)[0]}
                  </Badge>
                ))}
                {recipe.ingredients.length > 3 && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    +{recipe.ingredients.length - 3} more
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {recipe.instructions.substring(0, 100)}
                {recipe.instructions.length > 100 ? "..." : ""}
              </p>
            </CardContent>
            <CardFooter className="text-sm text-gray-500 flex items-center gap-2 border-t pt-4">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{recipe.cookingTime} minutes</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
