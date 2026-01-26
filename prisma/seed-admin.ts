import { createClient, User } from "@supabase/supabase-js";
/**
 * Seed Admin User into Supabase Auth
 *
 * This script:
 * 1. Creates a user in Supabase Auth using the Admin API
 * 2. Adds the user's Supabase UUID to the admins table
 *
 * Run: npx tsx prisma/seed-admin.ts
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";


// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  adapter: new PrismaPg(pool),
});

async function main() {
  console.log("🌱 Seeding admin user into Supabase Auth...\n");

  // Get credentials from environment
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "Admin";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables",
    );
  }

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }

  // Create Supabase Admin client (uses service role key)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Creating user: ${adminEmail}`);

  // Check if user already exists in Supabase
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const existingUser = existingUsers?.users?.find(
    (u: User) => u.email === adminEmail,
  );

  let supabaseUserId: string;

  if (existingUser) {
    console.log(`✓ User already exists in Supabase: ${adminEmail}`);
    console.log(`  UUID: ${existingUser.id}`);
    supabaseUserId = existingUser.id;
  } else {
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: adminName,
      },
    });

    if (error) {
      throw new Error(`Failed to create user in Supabase: ${error.message}`);
    }

    if (!data.user) {
      throw new Error("User creation succeeded but no user was returned");
    }

    console.log(`✓ User created in Supabase: ${adminEmail}`);
    console.log(`  UUID: ${data.user.id}`);
    console.log(`  Name: ${adminName}`);
    supabaseUserId = data.user.id;
  }

  // Check if user is already in admins table
  const existingAdmin = await prisma.admin.findUnique({
    where: { supabaseUserId },
  });

  if (existingAdmin) {
    console.log(`✓ User already has admin access in database`);
  } else {
    // Add user to admins table
    await prisma.admin.create({
      data: {
        supabaseUserId,
      },
    });
    console.log(`✓ Admin access granted in database`);
  }

  console.log("\n✅ Admin user seeded successfully!\n");
  console.log("Login credentials:");
  console.log(`  Email: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log(`  Supabase UUID: ${supabaseUserId}`);
  console.log("\n⚠️  Please change the password after first login!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
