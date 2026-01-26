/**
 * Next.js Proxy for Route Protection
 *
 * This proxy protects admin routes by verifying Supabase Auth sessions.
 * - Runs on the edge before requests reach the server
 * - Validates session cookie with Supabase
 * - Redirects unauthenticated users to login
 *
 * NOTE: Authentication is handled EXCLUSIVELY by Supabase Auth.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";


// Routes that require authentication
const PROTECTED_ROUTES = ["/admin/dashboard"];
// Routes that should redirect if already authenticated
const AUTH_ROUTES = ["/admin/auth/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create Supabase client for middleware
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session if needed (this is important for Supabase Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if this is a protected admin route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Check if this is an auth route
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // For protected routes, verify the user is authenticated
  if (isProtectedRoute) {
    if (!user) {
      // No user - redirect to login
      const loginUrl = new URL("/admin/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // User authenticated - continue to page
    // Admin role check is done in server actions/components via requireAdmin()
  }

  // For auth routes, redirect to dashboard if already authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Handle /admin base route
  if (pathname === "/admin" || pathname === "/admin/") {
    if (user) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }

  return response;
}

// Configure which routes the proxy runs on
export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
  ],
};
