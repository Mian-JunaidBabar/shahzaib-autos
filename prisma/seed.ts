/**
 * Prisma Seed Script
 *
 * Seeds the database with initial data:
 * - Sample products (optional)
 *
 * NOTE: User/Admin creation is handled EXCLUSIVELY by Supabase Auth.
 * After creating a user in Supabase, use the `addAdmin()` function from
 * lib/services/auth.service.ts to grant admin access.
 *
 * Run: npx prisma db seed
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";


const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Accept self-signed certificates from Supabase
      },
    })
  : undefined;

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
  adapter: pool ? new PrismaPg(pool) : undefined,
});

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ============ Admin User Notice ============
  console.log("ℹ️  Admin users are managed via Supabase Auth.");
  console.log(
    "   1. Create a user in Supabase Dashboard > Authentication > Users",
  );
  console.log("   2. Copy the user's UUID from Supabase");
  console.log("   3. Add them to the admins table:");
  console.log(
    "      INSERT INTO admins (supabase_user_id) VALUES ('supabase-uuid-here');\n",
  );

  // ============ Create Sample Products (Optional) ============
  const createSampleProducts = process.env.SEED_SAMPLE_DATA === "true";

  if (createSampleProducts) {
    console.log("Creating sample products...");

    const sampleProducts = [
      {
        name: "Engine Oil 5W-30",
        slug: "engine-oil-5w-30",
        description:
          "High-quality synthetic engine oil for optimal performance",
        price: 250000, // Price in cents (PKR 2500)
        category: "Oils & Fluids",
        badge: "BESTSELLER",
        badgeColor: "#10b981",
      },
      {
        name: "Air Filter Universal",
        slug: "air-filter-universal",
        description: "Universal air filter for various car models",
        price: 80000, // Price in cents (PKR 800)
        category: "Filters",
      },
      {
        name: "Brake Pads Set",
        slug: "brake-pads-set",
        description: "Premium brake pads for safe stopping",
        price: 350000, // Price in cents (PKR 3500)
        category: "Brakes",
        badge: "TRENDING",
        badgeColor: "#f59e0b",
      },
      {
        name: "Car Battery 12V 60Ah",
        slug: "car-battery-12v-60ah",
        description: "Reliable car battery with 2-year warranty",
        price: 1200000, // Price in cents (PKR 12000)
        category: "Electrical",
        badge: "HOT",
        badgeColor: "#ef4444",
      },
      {
        name: "Spark Plugs Set (4pcs)",
        slug: "spark-plugs-set-4pcs",
        description: "Iridium spark plugs for better ignition",
        price: 180000, // Price in cents (PKR 1800)
        category: "Ignition",
      },
    ];

    for (const product of sampleProducts) {
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug },
      });

      if (existing) {
        console.log(`  - ${product.name} already exists`);
        continue;
      }

      await prisma.product.create({
        data: {
          ...product,
          inventory: {
            create: {
              quantity: Math.floor(Math.random() * 50) + 10,
              lowStockAt: 10,
            },
          },
        },
      });
      console.log(`  ✓ Created: ${product.name}`);
    }
  }

  console.log("\n✅ Database seed completed!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
