import { prismaAdapter } from "better-auth/adapters/prisma";
/**
 * Better Auth Server Configuration
 *
 * This is the server-side auth configuration.
 * - Uses Prisma adapter for session/user storage
 * - Configured for admin-only authentication
 * - Includes role-based access control (RBAC)
 */
import { betterAuth } from "better-auth";

import { prisma } from "./prisma";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email + Password authentication
  emailAndPassword: {
    enabled: true,
    // Require email verification for new accounts (disabled for admin-only setup)
    requireEmailVerification: false,
  },

  // Session configuration
  session: {
    // Session expires in 7 days
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
    // Update session expiry on each request
    updateAge: 60 * 60 * 24, // 1 day in seconds
    // Use secure cookies in production
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // User configuration with custom fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STAFF",
        input: false, // Cannot be set by user during signup
      },
    },
  },

  // Trust host for proper URL generation
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});

// Export auth types for use throughout the app
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
