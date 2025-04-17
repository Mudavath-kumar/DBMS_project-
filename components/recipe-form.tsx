"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, Plus, Utensils, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createRecipe, updateRecipe } from "@/lib/recipes"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import type { Recipe, Category, Cuisine } from "@/lib/types"

interface RecipeFormProps {
  recipe?: Recipe
}

export function RecipeForm({ recipe }: RecipeFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [cuisines, setCuisines] = useState<Cuisine[]>([])

  const [title, setTitle] = useState(recipe?.title || "")
  const [description, setDescription] = useState(recipe?.description || "")
  const [cookingTime, setCookingTime] = useState(recipe?.cookingTime?.toString() || "")
  const [servings, setServings] = useState(recipe?.servings?.toString() || "")
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || "medium")
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || "")
  const [category, setCategory] = useState(recipe?.category || "")
  const [cuisine, setCuisine] = useState(recipe?.cuisine || "")
  const [dietary, setDietary] = useState<string[]>(recipe?.dietary || [])
  const [ingredients, setIngredients] = useState<string[]>(recipe?.ingredients || [""])
  const [instructions, setInstructions] = useState(recipe?.instructions || "")

  // Fetch categories and cuisines
  useState(() => {
    const fetchData = async () => {
      const [categoriesData, cuisinesData] = await Promise.all([getAllCategories(), getAllCuisines()])
      setCategories(categoriesData)
      setCuisines(cuisinesData)
    }
    fetchData()
  }, [])

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    setIngredients(newIngredients)
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleDietaryChange = (value: string) => {
    setDietary((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const recipeData = {
        title,
        description,
        cookingTime: Number.parseInt(cookingTime),
        servings: Number.parseInt(servings),
        difficulty: difficulty as "easy" | "medium" | "hard",
        imageUrl,
        category,
        cuisine,
        dietary,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        instructions,
      }

      if (recipe?._id) {
        await updateRecipe(recipe._id.toString(), recipeData)
        toast({
          title: "Recipe updated",
          description: "Your recipe has been updated successfully!",
        })
      } else {
        await createRecipe(recipeData)
        toast({
          title: "Recipe created",
          description: "Your recipe has been created successfully!",
        })
      }

      router.push("/my-recipes")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "keto", label: "Keto" },
    { id: "low-carb", label: "Low-Carb" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <Card className="border-amber-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Recipe Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
                placeholder="Enter a descriptive title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-gray-700">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
              placeholder="Briefly describe your recipe"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="border-amber-200 focus:border-orange-300 focus:ring-orange-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisine" className="text-gray-700">
                Cuisine
              </Label>
              <Select value={cuisine} onValueChange={setCuisine} required>
                <SelectTrigger className="border-amber-200 focus:border-orange-300 focus:ring-orange-200">
                  <SelectValue placeholder="Select a cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cui) => (
                    <SelectItem key={cui.slug} value={cui.name}>
                      {cui.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cookingTime" className="text-gray-700 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Cooking Time (minutes)
              </Label>
              <Input
                id="cookingTime"
                type="number"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
                min="1"
                className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-gray-700">
                Servings
              </Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                required
                min="1"
                className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-gray-700">
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty} required>
                <SelectTrigger className="border-amber-200 focus:border-orange-300 focus:ring-orange-200">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Dietary</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietary.includes(option.id)}
                    onCheckedChange={() => handleDietaryChange(option.id)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-gray-700 flex items-center">
              <Utensils className="mr-2 h-4 w-4 text-orange-500" />
              Ingredients
            </Label>
            <Button
              type="button"
              onClick={addIngredient}
              className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
                <Input
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g. 2 cups flour"
                  className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
                />
                {ingredients.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
        <CardContent className="p-6">
          <div className="grid gap-2">
            <Label htmlFor="instructions" className="text-gray-700 flex items-center">
              <span className="mr-2 h-5 w-5 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
                1
              </span>
              Instructions
            </Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows={8}
              className="border-amber-200 focus:border-orange-300 focus:ring-orange-200"
              placeholder="Describe the steps to prepare this recipe..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-gray-300">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
          {isLoading ? "Saving..." : recipe ? "Update Recipe" : "Save Recipe"}
        </Button>
      </div>
    </form>
  )
}
