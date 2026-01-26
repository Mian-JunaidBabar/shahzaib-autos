import { headers } from "next/headers";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
/**
 * Auth Service
 *
 * Server-side authentication utilities:
 * - Session verification
 * - Role-based access control (RBAC)
 * - Admin-only access enforcement
 */
import { auth } from "@/lib/auth";


export type AuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  session: {
    id: string;
    expiresAt: Date;
  };
};

/**
 * Get the current session from headers
 * Use this in server components and server actions
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    // Fetch the user's role from database (Better Auth stores it in additionalFields)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: user?.role || Role.STAFF,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
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
 * Require admin role - throws if not admin
 * Use for admin-only operations
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();

  if (session.user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN: Admin access required");
  }

  return session;
}

/**
 * Require specific role(s) - throws if user doesn't have any of the roles
 */
export async function requireRole(...roles: Role[]): Promise<AuthSession> {
  const session = await requireAuth();

  if (!roles.includes(session.user.role)) {
    throw new Error(`FORBIDDEN: Required role(s): ${roles.join(", ")}`);
  }

  return session;
}

/**
 * Check if user has permission - returns boolean instead of throwing
 */
export async function hasPermission(role: Role): Promise<boolean> {
  const session = await getServerSession();

  if (!session) {
    return false;
  }

  // ADMIN has all permissions
  if (session.user.role === Role.ADMIN) {
    return true;
  }

  return session.user.role === role;
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  return session?.user.role === Role.ADMIN;
}
