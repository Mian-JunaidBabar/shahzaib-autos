import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";


const globalForPrisma = global as unknown as { prisma: PrismaClient };

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
