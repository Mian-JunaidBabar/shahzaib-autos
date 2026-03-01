import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const badges = await prisma.badge.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const badgesWithUsage = [];
  for (const b of badges) {
    const usageCount = await prisma.product.count({ where: { badgeId: b.id } });
    badgesWithUsage.push({
      id: b.id,
      name: b.name,
      usageCount,
    });
  }

  return NextResponse.json(badgesWithUsage);
}
