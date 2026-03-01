import { subscribeEmail } from "@/lib/services/subscription.service";
import { NextResponse } from "next/server";

// Simple in-memory rate limiter: IP -> {count, firstSeen}
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_PER_IP = 10; // max requests per IP per window
const ipRateMap = new Map<string, { count: number; firstSeen: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toString().trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 },
      );
    }

    // Capture minimal metadata
    const ip = (
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"
    ).toString();
    const userAgent = req.headers.get("user-agent") || undefined;

    // Rate limiting by IP (best-effort, in-memory)
    const now = Date.now();
    const entry = ipRateMap.get(ip);
    if (entry) {
      if (now - entry.firstSeen > RATE_LIMIT_WINDOW_MS) {
        // reset window
        ipRateMap.set(ip, { count: 1, firstSeen: now });
      } else {
        if (entry.count >= RATE_LIMIT_MAX_PER_IP) {
          return NextResponse.json(
            { success: false, error: "Too many requests" },
            { status: 429 },
          );
        }
        entry.count += 1;
        ipRateMap.set(ip, entry);
      }
    } else {
      ipRateMap.set(ip, { count: 1, firstSeen: now });
    }

    const subscriber = await subscribeEmail(email, {
      source: "HOMEPAGE_FORM",
      ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      data: { email: subscriber.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
