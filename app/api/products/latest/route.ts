import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { images: true },
    });

    const payload = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      description: p.description,
      image: p.images?.[0]?.secureUrl ?? null,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ data: payload });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch latest products" },
      { status: 500 },
    );
  }
}
