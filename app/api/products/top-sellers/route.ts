import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    // Group order items by product and sum quantities for orders in the last 7 days
    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { order: { createdAt: { gte: since } } },
      orderBy: { _sum: { quantity: "desc" } },
      take: 4,
    });

    const productIds = grouped.map((g) => g.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isArchived: false, isActive: true },
      include: { images: true },
    });

    // preserve order based on grouped results
    const payload = grouped.map((g) => {
      const p = products.find((x) => x.id === g.productId)!;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        image: p.images?.[0]?.secureUrl ?? null,
        sold: g._sum.quantity ?? 0,
      };
    });

    return NextResponse.json({ data: payload });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch top sellers" },
      { status: 500 },
    );
  }
}
