/**
 * Better Auth Client Configuration
 *
 * This is the client-side auth configuration.
 * Used in React components for auth operations.
 */
import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Export commonly used hooks and utilities
export const { signIn, signOut, signUp, useSession, getSession } = authClient;
