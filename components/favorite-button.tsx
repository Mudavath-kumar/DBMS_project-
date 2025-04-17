"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { addToFavorites, removeFromFavorites } from "@/lib/auth"

interface FavoriteButtonProps {
  recipeId: string
  userId: string
}

export function FavoriteButton({ recipeId, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        // This would be a server action to check if the recipe is in user's favorites
        // For now, we'll use localStorage as a simple solution
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(recipeId))
      } catch (error) {
        console.error("Error checking favorite status:", error)
      }
    }

    checkIfFavorite()
  }, [recipeId])

  const toggleFavorite = async () => {
    setIsLoading(true)
    try {
      // Update local state immediately for better UX
      setIsFavorite(!isFavorite)

      // Update localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      if (isFavorite) {
        localStorage.setItem("favorites", JSON.stringify(favorites.filter((id: string) => id !== recipeId)))
        await removeFromFavorites(userId, recipeId)
        toast({
          title: "Removed from favorites",
          description: "This recipe has been removed from your favorites.",
        })
      } else {
        localStorage.setItem("favorites", JSON.stringify([...favorites, recipeId]))
        await addToFavorites(userId, recipeId)
        toast({
          title: "Added to favorites",
          description: "This recipe has been added to your favorites.",
        })
      }
    } catch (error) {
      // Revert local state if server action fails
      setIsFavorite(!isFavorite)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      className={`${
        isFavorite ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={toggleFavorite}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-600" : ""}`} />
      {isFavorite ? "Favorited" : "Add to Favorites"}
    </Button>
  )
}
