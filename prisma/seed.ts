/**
 * Prisma Seed Script
 *
 * Seeds the database with initial data:
 * - Admin user
 * - Sample products (optional)
 *
 * Run: npx prisma db seed
 */
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "@node-rs/argon2";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ============ Create Admin User ============
  const adminEmail = process.env.ADMIN_EMAIL || "admin@shahzaibautos.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`);
  } else {
    const hashedPassword = await hash(adminPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        role: Role.ADMIN,
        emailVerified: true,
      },
    });

    // Create account with password
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (user) {
      await prisma.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          accountId: user.id,
          password: hashedPassword,
        },
      });

      console.log(`✓ Admin user created: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}`);
      console.log("\n  ⚠️  Please change the password after first login!\n");
    }
  }

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
        price: 2500,
        category: "Oils & Fluids",
        brand: "Castrol",
        sku: "OIL-5W30-001",
        featured: true,
      },
      {
        name: "Air Filter Universal",
        slug: "air-filter-universal",
        description: "Universal air filter for various car models",
        price: 800,
        category: "Filters",
        brand: "Mann Filter",
        sku: "FIL-AIR-001",
        featured: false,
      },
      {
        name: "Brake Pads Set",
        slug: "brake-pads-set",
        description: "Premium brake pads for safe stopping",
        price: 3500,
        category: "Brakes",
        brand: "Brembo",
        sku: "BRK-PAD-001",
        featured: true,
      },
      {
        name: "Car Battery 12V 60Ah",
        slug: "car-battery-12v-60ah",
        description: "Reliable car battery with 2-year warranty",
        price: 12000,
        category: "Electrical",
        brand: "AGS",
        sku: "BAT-12V-001",
        featured: true,
      },
      {
        name: "Spark Plugs Set (4pcs)",
        slug: "spark-plugs-set-4pcs",
        description: "Iridium spark plugs for better ignition",
        price: 1800,
        category: "Ignition",
        brand: "NGK",
        sku: "SPK-IRD-001",
        featured: false,
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
