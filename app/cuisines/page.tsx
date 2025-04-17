import Link from "next/link"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { getAllCuisines } from "@/lib/cuisines"

export default async function CuisinesPage() {
  const cuisines = await getAllCuisines()

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-brown-900">Explore Cuisines</h1>
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
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4">
                  <h3 className="font-medium text-xl text-white mb-2">{cuisine.name}</h3>
                  <p className="text-white/80 text-sm">{cuisine.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
