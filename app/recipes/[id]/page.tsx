import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, Edit, User, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecipeById } from "@/lib/recipes"
import { getCurrentUser } from "@/lib/auth"
import { DeleteRecipeButton } from "@/components/delete-recipe-button"
import { FavoriteButton } from "@/components/favorite-button"
import { RatingStars } from "@/components/rating-stars"
import { RecipeRatingForm } from "@/components/recipe-rating-form"

export default async function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, currentUser] = await Promise.all([getRecipeById(params.id), getCurrentUser()])

  if (!recipe) {
    notFound()
  }

  const isAuthor = currentUser && recipe.authorId === currentUser._id?.toString()

  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900">{recipe.title}</h1>
            <div className="flex gap-2">
              {isAuthor && (
                <>
                  <Link href={`/recipes/${recipe._id}/edit`}>
                    <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteRecipeButton id={recipe._id?.toString() || ""} />
                </>
              )}
              {currentUser && (
                <FavoriteButton recipeId={recipe._id?.toString() || ""} userId={currentUser._id?.toString() || ""} />
              )}
            </div>
          </div>

          <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
            <Image
              src={recipe.imageUrl || "/placeholder.svg?height=600&width=800"}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              {recipe.category}
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              {recipe.cuisine}
            </Badge>
            {recipe.dietary.map((diet) => (
              <Badge key={diet} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                {diet}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-500" />
              <span className="font-medium">{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{recipe.difficulty} difficulty</span>
            </div>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
          </div>

          <Card className="border-amber-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                <Utensils className="mr-2 h-5 w-5 text-orange-500" />
                Ingredients
              </h2>
              <ul className="grid gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-400" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                <span className="mr-2 h-5 w-5 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                  1
                </span>
                Instructions
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">{recipe.instructions}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-100 overflow-hidden sticky top-20">
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium">{recipe.authorName}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-medium mb-2">Rating</h3>
                <div className="flex items-center gap-2 mb-1">
                  <RatingStars rating={recipe.averageRating} />
                  <span className="text-sm text-muted-foreground">
                    ({recipe.ratings.length} {recipe.ratings.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
                {currentUser && !isAuthor && <RecipeRatingForm recipeId={recipe._id?.toString() || ""} />}
              </div>

              {recipe.ratings.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Reviews</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {recipe.ratings
                      .filter((rating) => rating.comment)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((rating, index) => (
                        <div key={index} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center">
                              <RatingStars rating={rating.value} size="sm" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{rating.comment}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
