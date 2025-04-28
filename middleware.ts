import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/appointments", "/profile", "/admin"]

// Paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/signup", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  // Check if the path is for non-authenticated users only
  const isAuthPath = authPaths.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))

  // If there's no token and the path is protected, redirect to login
  if (!token && isProtectedPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // If there's a token
  if (token) {
    try {
      // Verify the token
      const decoded = await verifyToken(token)

      // If the token is valid and the path is for non-authenticated users only,
      // redirect to dashboard
      if (decoded && isAuthPath) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // If the path is admin and the user is not an admin, redirect to dashboard
      if (path.startsWith("/admin") && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // If token verification fails, clear the cookie and redirect to login
      // for protected paths
      if (isProtectedPath) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        response.cookies.delete("token")
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
