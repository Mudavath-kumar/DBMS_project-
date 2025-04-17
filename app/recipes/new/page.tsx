import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { RecipeForm } from "@/components/recipe-form"
import { requireAuth } from "@/lib/auth"

export default async function NewRecipePage() {
  // Make sure the user is authenticated
  await requireAuth()

  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Link>

      <h1 className="text-3xl font-serif font-bold tracking-tight mb-6 text-gray-900">Add New Recipe</h1>
      <RecipeForm />
    </div>
  )
}
