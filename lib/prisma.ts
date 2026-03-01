import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use DIRECT_URL for better compatibility with Prisma Postgres adapter
// DIRECT_URL connects directly to the database without pgbouncer
const rawConnectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const connectionString = rawConnectionString
  ? rawConnectionString.includes("?")
    ? rawConnectionString.replace(/sslmode=verify-full/g, "sslmode=require") +
      "&uselibpqcompat=true"
    : rawConnectionString + "?uselibpqcompat=true&sslmode=require"
  : rawConnectionString;

// Default pool size; can be overridden with DB_POOL_MAX or DB_MAX_CLIENTS
const defaultPoolMax = Number(
  process.env.DB_POOL_MAX ?? process.env.DB_MAX_CLIENTS ?? 1,
);

const pool = connectionString
  ? new Pool({
      connectionString,
      // Bypass self-signed cert check in development only
      // Production will use strict verification (true)
      ssl:
        process.env.NODE_ENV !== "production"
          ? { rejectUnauthorized: false }
          : { rejectUnauthorized: true },
      max: defaultPoolMax,
    })
  : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error"],
    adapter: pool ? new PrismaPg(pool) : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
