import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes that require authentication
  const protectedAdminRoutes = ["/admin/dashboard"];
  const isProtectedAdminRoute = protectedAdminRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Auth routes that should redirect if already authenticated
  const authRoutes = ["/admin/auth/login"];
  const isAuthRoute = authRoutes.includes(pathname);

  // Check for admin token
  const adminToken = request.cookies.get("admin_token")?.value;
  const isAuthenticated = !!adminToken;

  // Redirect to login if trying to access protected admin route without auth
  if (isProtectedAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  // Redirect to dashboard if trying to access auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect /admin to /admin/dashboard if authenticated, otherwise to login
  if (pathname === "/admin") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes
     */
    "/admin/:path*",
  ],
};
