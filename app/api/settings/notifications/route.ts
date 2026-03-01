import type { NotificationSettings } from "@prisma/client";
import { requireAdmin } from "@/lib/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    let settings: NotificationSettings | null =
      await prisma.notificationSettings.findUnique({
        where: { id: 1 },
      });

    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: { id: 1 },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      newOrderEmail,
      newBookingEmail,
      newLeadEmail,
      orderStatusEmail,
      lowStockEmail,
      staleOrderEmail,
      bookingReminderSms,
      orderConfirmSms,
    } = body;

    const settings = await prisma.notificationSettings.upsert({
      where: { id: 1 },
      update: {
        ...(newOrderEmail !== undefined && { newOrderEmail }),
        ...(newBookingEmail !== undefined && { newBookingEmail }),
        ...(newLeadEmail !== undefined && { newLeadEmail }),
        ...(orderStatusEmail !== undefined && { orderStatusEmail }),
        ...(lowStockEmail !== undefined && { lowStockEmail }),
        ...(staleOrderEmail !== undefined && { staleOrderEmail }),
        ...(bookingReminderSms !== undefined && { bookingReminderSms }),
        ...(orderConfirmSms !== undefined && { orderConfirmSms }),
      },
      create: {
        id: 1,
        newOrderEmail: newOrderEmail ?? true,
        newBookingEmail: newBookingEmail ?? true,
        newLeadEmail: newLeadEmail ?? true,
        orderStatusEmail: orderStatusEmail ?? false,
        lowStockEmail: lowStockEmail ?? true,
        staleOrderEmail: staleOrderEmail ?? true,
        bookingReminderSms: bookingReminderSms ?? true,
        orderConfirmSms: orderConfirmSms ?? false,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
