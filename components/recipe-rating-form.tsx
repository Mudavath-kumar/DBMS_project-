"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { rateRecipe } from "@/lib/recipes"

interface RecipeRatingFormProps {
  recipeId: string
}

export function RecipeRatingForm({ recipeId }: RecipeRatingFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await rateRecipe(recipeId, rating, comment)
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      })
      setIsFormOpen(false)
      setRating(0)
      setComment("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-2">
      {!isFormOpen ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFormOpen(true)}
          className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
        >
          Rate this recipe
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className="p-1"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`h-6 w-6 ${
                    i < (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your thoughts about this recipe (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || rating === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
