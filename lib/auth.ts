import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
/**
 * Supabase Auth - Server-side utilities
 *
 * Creates a Supabase client for server-side operations.
 * Use in Server Components, Server Actions, and Route Handlers.
 *
 * NOTE: All authentication is handled by Supabase Auth.
 * We do NOT store users, passwords, or sessions in Prisma.
 */
import { cache } from "react";


// Supabase environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for server-side operations
 * Automatically handles cookie-based auth
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: CookieOptions;
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Get the current authenticated user from Supabase
 * Returns null if not authenticated
 * Cached to prevent duplicate calls within the same request
 */
export const getSupabaseUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

/**
 * Get the current session from Supabase
 * Returns null if no active session
 * Cached to prevent duplicate calls within the same request
 */
export const getSupabaseSession = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
});
