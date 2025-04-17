import Link from "next/link"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { getAllCategories } from "@/lib/categories"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-brown-900">Recipe Categories</h1>
        <p className="text-brown-600">Browse recipes by meal type</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 text-center group">
              <div className="relative h-48 w-full">
                <Image
                  src={category.imageUrl || "/placeholder.svg?height=300&width=400"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4">
                  <h3 className="font-medium text-xl text-white mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
