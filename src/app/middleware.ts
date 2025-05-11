// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that should be protected (require authentication)
const protectedPaths = [
  "/",
  "/access-log",
  "/analytics",
  "/add-user",
  "/edit-user",
  // Add any other protected routes
];

// Define paths that are only accessible to non-authenticated users
const publicOnlyPaths = [
  "/login",
  // Add any other paths that should redirect to dashboard if user is already logged in
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there's an authentication token
  const authToken = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!authToken;

  // For protected paths: redirect to login if not authenticated
  if (pathMatchesAny(pathname, protectedPaths) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // Store the URL they were trying to visit
    loginUrl.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // For public-only paths: redirect to dashboard if already authenticated
  if (pathMatchesAny(pathname, publicOnlyPaths) && isAuthenticated) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For all other cases, continue
  return NextResponse.next();
}

// Helper function to match a path against an array of paths
function pathMatchesAny(path: string, pathArray: string[]): boolean {
  return pathArray.some((pattern) => {
    // Exact match
    if (pattern === path) return true;

    // Pattern ends with '*' for wildcard matching
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return path.startsWith(prefix);
    }

    return false;
  });
}

// Configure which paths this middleware should run on
export const config = {
  // Add other paths if needed
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
