/**
 * Auth Service
 *
 * Server-side authentication utilities using Supabase Auth:
 * - Session verification via Supabase
 * - Admin access verification via Prisma `admins` table
 *
 * NOTE: Authentication is handled EXCLUSIVELY by Supabase Auth.
 * We only store the Supabase user ID in the `admins` table to grant admin access.
 */
import { createSupabaseServerClient, getSupabaseUser } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";


export type AuthSession = {
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
};

/**
 * Get the current session from Supabase Auth
 * Use this in server components and server actions
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const user = await getSupabaseUser();

    if (!user) {
      return null;
    }

    // Check if user is an admin by looking up their Supabase ID in the admins table
    const admin = await prisma.admin.findUnique({
      where: { supabaseUserId: user.id },
    });

    return {
      user: {
        id: user.id,
        email: user.email || "",
        isAdmin: !!admin,
      },
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Require authentication - throws if not authenticated
 * Use at the start of protected server actions
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED: Authentication required");
  }

  return session;
}

/**
 * Require admin access - throws if user is not in the admins table
 * Use for admin-only operations
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();

  if (!session.user.isAdmin) {
    throw new Error("FORBIDDEN: Admin access required");
  }

  return session;
}

/**
 * Check if current user has admin access - returns boolean instead of throwing
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  return session?.user.isAdmin ?? false;
}

/**
 * Get the Supabase Auth user directly
 * Useful when you need the full Supabase user object
 */
export async function getAuthUser(): Promise<User | null> {
  return getSupabaseUser();
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

/**
 * Add a Supabase user as an admin
 * Call this after creating a user in Supabase Auth to grant admin access
 */
export async function addAdmin(supabaseUserId: string): Promise<void> {
  await prisma.admin.upsert({
    where: { supabaseUserId },
    update: {},
    create: { supabaseUserId },
  });
}

/**
 * Remove admin access from a Supabase user
 */
export async function removeAdmin(supabaseUserId: string): Promise<void> {
  await prisma.admin.delete({
    where: { supabaseUserId },
  });
}

/**
 * Check if a Supabase user ID has admin access
 */
export async function checkIsAdmin(supabaseUserId: string): Promise<boolean> {
  const admin = await prisma.admin.findUnique({
    where: { supabaseUserId },
  });
  return !!admin;
}
