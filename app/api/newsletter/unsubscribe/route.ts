import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const e = url.searchParams.get("e");
    if (!e) {
      return NextResponse.json(
        { success: false, error: "Missing param" },
        { status: 400 },
      );
    }

    let email: string;
    try {
      email = Buffer.from(decodeURIComponent(e), "base64").toString("utf8");
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid param" },
        { status: 400 },
      );
    }

    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { subscribed: false, unsubscribedAt: new Date() },
    });

    // Return a simple confirmation page
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head><body style="font-family: Arial, sans-serif; padding:40px; text-align:center;"><h1>You're unsubscribed</h1><p>${email} has been removed from our newsletter list.</p></body></html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
