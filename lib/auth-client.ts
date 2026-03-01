import type { SupabaseClient } from "@supabase/supabase-js";
/**
 * Supabase Auth - Client-side utilities
 *
 * Creates a Supabase client for browser-side operations.
 * Use in Client Components for auth operations.
 *
 * NOTE: All authentication is handled by Supabase Auth.
 * We do NOT store users, passwords, or sessions in Prisma.
 */
import { createBrowserClient } from "@supabase/ssr";

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Create a Supabase client for browser-side operations
 * Uses lazy initialization to avoid issues during SSR/build
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

/**
 * Get the Supabase client singleton
 * Use this in components instead of directly importing `supabase`
 */
export function getSupabaseClient(): SupabaseClient {
  return createSupabaseBrowserClient();
}

// For backward compatibility - lazy getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = createSupabaseBrowserClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  },
});
