import { getTopTags } from "@/lib/services/product.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topTags = await getTopTags(3);
    return NextResponse.json(topTags);
  } catch (error) {
    console.error("Error fetching top tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch top tags" },
      { status: 500 },
    );
  }
}
