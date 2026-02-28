import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  const names = categories
    .map((c) => c.category)
    .filter((c): c is string => !!c);

  return NextResponse.json(names);
}
