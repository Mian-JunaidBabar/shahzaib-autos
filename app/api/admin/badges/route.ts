import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const badges = await prisma.badge.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const badgesWithUsage = await Promise.all(
    badges.map(async (b) => ({
      id: b.id,
      name: b.name,
      usageCount: await prisma.product.count({ where: { badgeId: b.id } }),
    })),
  );

  return NextResponse.json(badgesWithUsage);
}
