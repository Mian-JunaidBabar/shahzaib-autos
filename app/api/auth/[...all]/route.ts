/**
 * Supabase Auth API Route Handler
 *
 * Supabase Auth uses client-side SDK for authentication.
 * This route is kept for any custom auth callbacks if needed.
 *
 * NOTE: All authentication is handled EXCLUSIVELY by Supabase Auth.
 * Users sign in via the Supabase client SDK, not via these API routes.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";


// Handle auth callbacks (e.g., email confirmation, password reset)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(
    `${origin}/admin/auth/login?error=auth_callback_failed`,
  );
}

// POST handler for any custom operations
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: "Use Supabase client SDK for authentication" },
    { status: 400 },
  );
}
