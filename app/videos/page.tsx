import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function VideosPage() {
  // Mock data for cooking videos
  const videos = [
    {
      id: "1",
      title: "Perfect Pasta Carbonara",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "12:45",
      author: "Chef Maria",
      views: "125K",
    },
    {
      id: "2",
      title: "Easy Homemade Pizza",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "18:30",
      author: "Cooking with John",
      views: "98K",
    },
    {
      id: "3",
      title: "Chocolate Cake Masterclass",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "22:15",
      author: "Baking Basics",
      views: "210K",
    },
    {
      id: "4",
      title: "Quick Breakfast Ideas",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "15:20",
      author: "Morning Meals",
      views: "76K",
    },
    {
      id: "5",
      title: "Authentic Thai Curry",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "25:10",
      author: "Global Flavors",
      views: "145K",
    },
    {
      id: "6",
      title: "Sourdough Bread Tutorial",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "32:45",
      author: "Bread Master",
      views: "189K",
    },
    {
      id: "7",
      title: "Vegetarian Meal Prep",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "28:15",
      author: "Healthy Eats",
      views: "112K",
    },
    {
      id: "8",
      title: "Sushi Rolling Techniques",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "19:50",
      author: "Japanese Cuisine",
      views: "230K",
    },
    {
      id: "9",
      title: "Perfect Steak Guide",
      thumbnail: "/placeholder.svg?height=300&width=400",
      duration: "14:30",
      author: "Meat Lovers",
      views: "175K",
    },
  ]

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-brown-900">Cooking Videos</h1>
        <p className="text-brown-600">Watch and learn from our collection of cooking tutorials</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Link key={video.id} href={`/videos/${video.id}`}>
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-48 w-full">
                <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-14 w-14 rounded-full bg-white/80 flex items-center justify-center">
                    <Play className="h-6 w-6 text-brown-800 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-1">{video.title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{video.author}</span>
                  <span>{video.views} views</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
