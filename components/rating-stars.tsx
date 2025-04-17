import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  size?: "sm" | "md" | "lg"
}

export function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass[size]} ${
            i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}
