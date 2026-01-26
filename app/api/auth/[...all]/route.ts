import { toNextJsHandler } from "better-auth/next-js";
/**
 * Better Auth API Route Handler
 *
 * This handles all auth-related API requests:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - etc.
 */
import { auth } from "@/lib/auth";


export const { GET, POST } = toNextJsHandler(auth);
