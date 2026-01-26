import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Allow self-signed certs in local/dev to avoid TLS errors when the proxy injects a cert
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const connectionString = process.env.DATABASE_URL;
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Accept Supabase self-signed certificates
      },
    })
  : undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error"],
    adapter: pool ? new PrismaPg(pool) : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
