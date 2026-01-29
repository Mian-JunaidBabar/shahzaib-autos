import { requireAdmin } from "@/lib/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get settings without auth requirement for time slots display
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      // Return default settings if not found
      return NextResponse.json({
        bookingTimeSlots: [
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
        ],
        minAdvanceBookingDays: 1,
        maxAdvanceBookingDays: 30,
      });
    }

    return NextResponse.json({
      bookingTimeSlots: settings.bookingTimeSlots,
      minAdvanceBookingDays: settings.minAdvanceBookingDays,
      maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
      maxBookingsPerSlot: settings.maxBookingsPerSlot,
    });
  } catch (error) {
    console.error("Error fetching booking settings:", error);
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
      bookingTimeSlots,
      minAdvanceBookingDays,
      maxAdvanceBookingDays,
      maxBookingsPerSlot,
    } = body;

    const settings = await prisma.businessSettings.upsert({
      where: { id: "default" },
      update: {
        ...(bookingTimeSlots && { bookingTimeSlots }),
        ...(minAdvanceBookingDays && { minAdvanceBookingDays }),
        ...(maxAdvanceBookingDays && { maxAdvanceBookingDays }),
        ...(maxBookingsPerSlot && { maxBookingsPerSlot }),
      },
      create: {
        id: "default",
        bookingTimeSlots: bookingTimeSlots || [
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
        ],
        minAdvanceBookingDays: minAdvanceBookingDays || 1,
        maxAdvanceBookingDays: maxAdvanceBookingDays || 30,
        maxBookingsPerSlot: maxBookingsPerSlot || 3,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        bookingTimeSlots: settings.bookingTimeSlots,
        minAdvanceBookingDays: settings.minAdvanceBookingDays,
        maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
        maxBookingsPerSlot: settings.maxBookingsPerSlot,
      },
    });
  } catch (error) {
    console.error("Error updating booking settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
