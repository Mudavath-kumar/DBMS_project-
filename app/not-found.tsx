import Link from "next/link"
import { ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <div className="bg-amber-100 p-4 rounded-full mb-6">
        <ChefHat className="h-12 w-12 text-orange-500" />
      </div>
      <h1 className="text-4xl font-serif font-bold mb-4 text-brown-900">Page Not Found</h1>
      <p className="text-xl text-brown-600 mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <div className="flex gap-4">
        <Button asChild className="bg-brown-600 hover:bg-brown-700">
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    </div>
  )
}
