import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { RecipeForm } from "@/components/recipe-form"
import { getRecipeById } from "@/lib/recipes"
import { requireAuth } from "@/lib/auth"

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, user] = await Promise.all([getRecipeById(params.id), requireAuth()])

  if (!recipe) {
    notFound()
  }

  // Check if the user is the author of the recipe
  if (recipe.authorId !== user._id?.toString()) {
    notFound()
  }

  return (
    <div className="container py-8">
      <Link
        href={`/recipes/${params.id}`}
        className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipe
      </Link>

      <h1 className="text-3xl font-serif font-bold tracking-tight mb-6 text-gray-900">Edit Recipe</h1>
      <RecipeForm recipe={recipe} />
    </div>
  )
}
