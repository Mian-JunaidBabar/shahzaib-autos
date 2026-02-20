import { AdminStaleOrderWarning } from "@/emails/AdminStaleOrderWarning";
import { sendEmail, adminEmail } from "@/lib/services/mail.service";
/**
 * Stale Orders Cron Job
 *
 * This API route is designed to be called by Vercel Cron (or any external scheduler).
 * It checks for orders that have been in NEW status for more than 24 hours,
 * marks them as STALE, and sends a summary email to the admin.
 *
 * Schedule: Daily at 10:00 AM UTC (configured in vercel.json)
 */
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Vercel Cron protection - optional secret for security
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify cron secret if configured (recommended for production)
  if (CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all orders that are still NEW and older than 24 hours
    const staleOrders = await prisma.order.findMany({
      where: {
        status: "NEW",
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc", // Oldest first
      },
    });

    if (staleOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No stale orders found.",
        staleCount: 0,
      });
    }

    // Mark orders as STALE
    await prisma.order.updateMany({
      where: {
        id: {
          in: staleOrders.map((o) => o.id),
        },
      },
      data: {
        status: "STALE" as OrderStatus,
      },
    });

    // Build admin URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const adminOrdersUrl = `${appUrl}/admin/dashboard/orders?status=STALE`;

    // Send ONE summary email to the admin
    await sendEmail({
      to: adminEmail,
      subject: `🚨 Action Required: ${staleOrders.length} Stale Order${staleOrders.length > 1 ? "s" : ""} Detected`,
      react: AdminStaleOrderWarning({
        staleOrders: staleOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          total: order.total,
          createdAt: order.createdAt,
        })),
        adminUrl: adminOrdersUrl,
      }),
    });

    console.log(
      `[Cron] Marked ${staleOrders.length} orders as stale and notified admin`,
    );

    return NextResponse.json({
      success: true,
      message: `${staleOrders.length} orders marked as stale.`,
      staleCount: staleOrders.length,
      orderNumbers: staleOrders.map((o) => o.orderNumber),
    });
  } catch (error) {
    console.error("[Cron] Error checking stale orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check stale orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
