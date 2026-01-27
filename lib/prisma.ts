import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In development, use libpq compatibility mode with weak SSL to work with Supabase self-signed certs
// In production, use strict SSL verification
const rawConnectionString = process.env.DATABASE_URL;
const connectionString =
  rawConnectionString && process.env.NODE_ENV !== "production"
    ? rawConnectionString.includes("?")
      ? rawConnectionString + "&uselibpqcompat=true&sslmode=require"
      : rawConnectionString + "?uselibpqcompat=true&sslmode=require"
    : rawConnectionString;

const pool = connectionString
  ? new Pool({
      connectionString,
      // Bypass self-signed cert check in development only
      // Production will use strict verification (true)
      ssl:
        process.env.NODE_ENV !== "production"
          ? { rejectUnauthorized: false }
          : true,
    })
  : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error"],
    adapter: pool ? new PrismaPg(pool) : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
