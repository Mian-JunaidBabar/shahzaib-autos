/**
 * Next.js Proxy for Route Protection
 *
 * This proxy protects admin routes by verifying Better Auth sessions.
 * - Runs on the edge before requests reach the server
 * - Validates session cookie with Better Auth
 * - Redirects unauthenticated users to login
 */
import { NextRequest, NextResponse } from "next/server";


// Routes that require authentication
const PROTECTED_ROUTES = ["/admin/dashboard"];
// Routes that should redirect if already authenticated
const AUTH_ROUTES = ["/admin/auth/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected admin route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Check if this is an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Get Better Auth session cookie
  // Better Auth uses a cookie named "better-auth.session_token" by default
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // For protected routes, verify the session exists
  if (isProtectedRoute) {
    if (!sessionToken) {
      // No session - redirect to login
      const loginUrl = new URL("/admin/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists - verify it's valid by calling Better Auth API
    // This is done server-side in the layout/page for full validation
    // Proxy just does a quick cookie check for performance
  }

  // For auth routes, redirect to dashboard if already authenticated
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Handle /admin base route
  if (pathname === "/admin" || pathname === "/admin/") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the proxy runs on
export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
  ],
};
