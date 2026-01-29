import { getDefaultOperatingHours } from "@/lib/services/slot.service";
import { prisma } from "@/lib/prisma";

export async function seedBookingSettings() {
  try {
    // Check if booking settings already exist
    const existing = await prisma.bookingSettings.findUnique({
      where: { id: 1 },
    });

    if (existing) {
      console.log("✓ BookingSettings already exist");
      return;
    }

    // Create default booking settings
    const bookingSettings = await prisma.bookingSettings.create({
      data: {
        id: 1,
        slotDuration: 60, // 1 hour slots
        bufferTime: 15, // 15 minutes between bookings
        advanceBookingDays: 30, // Can book up to 30 days in advance
        allowSameDayBooking: true, // Allow same-day bookings
        operatingHours: getDefaultOperatingHours(),
      },
    });

    console.log("✓ BookingSettings created:", bookingSettings);
  } catch (error) {
    console.error("Error seeding booking settings:", error);
    throw error;
  }
}
