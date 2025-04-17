import Link from "next/link"
import { User, Mail, Calendar, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"
import { getUserRecipes } from "@/lib/recipes"

export default async function ProfilePage() {
  const user = await requireAuth()
  const recipes = await getUserRecipes(user._id?.toString() || "")

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-brown-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-brown-600" />
                </div>
                <div>
                  <h2 className="text-xl font-medium">{user.name}</h2>
                  <p className="text-muted-foreground">Member</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/profile/edit">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{recipes.length}</CardTitle>
                <CardDescription>Recipes</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Link href="/my-recipes" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{user.favorites.length}</CardTitle>
                <CardDescription>Favorites</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Link href="/favorites" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure which emails you want to receive from RecipeHaven
                </p>
                <div className="grid gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="new-recipes" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="new-recipes" className="text-sm">
                      New recipes from chefs you follow
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="comments" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="comments" className="text-sm">
                      Comments on your recipes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ratings" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="ratings" className="text-sm">
                      Ratings on your recipes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
                    <label htmlFor="newsletter" className="text-sm">
                      Weekly newsletter and cooking tips
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">Control your privacy preferences</p>
                <div className="grid gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="public-profile" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="public-profile" className="text-sm">
                      Make my profile public
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="show-favorites" className="rounded border-gray-300" defaultChecked />
                    <label htmlFor="show-favorites" className="text-sm">
                      Show my favorite recipes to others
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-brown-600 hover:bg-brown-700">Save Preferences</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline">Download My Data</Button>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
