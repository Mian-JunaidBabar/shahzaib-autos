import { requireAdmin } from "@/lib/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const prismaClient = prisma as any;

export async function GET() {
  try {
    const { getDefaultOperatingHours } =
      await import("@/lib/services/slot.service");

    let settings: any = await prismaClient.bookingSettings.findUnique({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prismaClient.bookingSettings.create({
        data: {
          id: 1,
          operatingHours: getDefaultOperatingHours(),
        },
      });
    }

    return NextResponse.json(settings);
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

    const { getDefaultOperatingHours } =
      await import("@/lib/services/slot.service");
    const body = await request.json();
    const {
      slotDuration,
      bufferTime,
      advanceBookingDays,
      allowSameDayBooking,
      operatingHours,
    } = body;

    const settings = await prismaClient.bookingSettings.upsert({
      where: { id: 1 },
      update: {
        ...(slotDuration && { slotDuration }),
        ...(bufferTime !== undefined && { bufferTime }),
        ...(advanceBookingDays && { advanceBookingDays }),
        ...(allowSameDayBooking !== undefined && { allowSameDayBooking }),
        ...(operatingHours && { operatingHours }),
      },
      create: {
        id: 1,
        slotDuration: slotDuration || 60,
        bufferTime: bufferTime !== undefined ? bufferTime : 15,
        advanceBookingDays: advanceBookingDays || 30,
        allowSameDayBooking:
          allowSameDayBooking !== undefined ? allowSameDayBooking : true,
        operatingHours: operatingHours || getDefaultOperatingHours(),
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating booking settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
