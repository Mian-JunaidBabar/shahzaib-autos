import type { BookingSettings, Prisma } from "@prisma/client";
/**
 * Slot Generation Service
 * Generates available time slots based on operating hours, existing bookings, and buffer time
 */
import { prisma } from "@/lib/prisma";


const prismaClient = prisma;

export interface OperatingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  openTime: string; // "09:00" format
  closeTime: string; // "18:00" format
}

/**
 * Get default operating hours (Mon-Fri 9AM-6PM, Closed weekends)
 */
export const getDefaultOperatingHours = (): OperatingHours[] => {
  return [
    { dayOfWeek: 0, isOpen: false, openTime: "", closeTime: "" }, // Sunday
    { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Monday
    { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Tuesday
    { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Wednesday
    { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Thursday
    { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "18:00" }, // Friday
    { dayOfWeek: 6, isOpen: false, openTime: "", closeTime: "" }, // Saturday
  ];
};

/**
 * Convert time string "HH:MM" to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight back to "HH:MM" format
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/**
 * Generate all possible time slots for a given date
 */
function generateAllSlots(
  date: Date,
  operatingHours: OperatingHours[],
  slotDuration: number,
): string[] {
  const dayOfWeek = date.getDay();
  const todayHours = operatingHours.find((h) => h.dayOfWeek === dayOfWeek);

  if (!todayHours || !todayHours.isOpen) {
    return [];
  }

  const slots: string[] = [];
  const openTimeMinutes = timeToMinutes(todayHours.openTime);
  const closeTimeMinutes = timeToMinutes(todayHours.closeTime);

  for (
    let timeMinutes = openTimeMinutes;
    timeMinutes < closeTimeMinutes;
    timeMinutes += slotDuration
  ) {
    slots.push(minutesToTime(timeMinutes));
  }

  return slots;
}

/**
 * Get available time slots for a given date
 * Removes slots that conflict with existing bookings
 */
export async function getAvailableSlots(
  date: Date,
  workingDate: Date = new Date(), // For testing purposes
): Promise<string[]> {
  try {
    // Fetch booking settings
    let settings = (await prismaClient.bookingSettings.findUnique({
      where: { id: 1 },
    })) as BookingSettings | null;

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prismaClient.bookingSettings.create({
        data: {
          id: 1,
          operatingHours:
            getDefaultOperatingHours() as unknown as Prisma.InputJsonValue,
        },
      });
    }

    const operatingHours =
      (settings.operatingHours as unknown as OperatingHours[]) ||
      getDefaultOperatingHours();
    const slotDuration = settings.slotDuration;
    const bufferTime = settings.bufferTime;

    // Check if date is in the past
    const today = new Date(workingDate);
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today && !settings.allowSameDayBooking) {
      return [];
    }

    // Generate all possible slots
    const allSlots = generateAllSlots(date, operatingHours, slotDuration);

    if (allSlots.length === 0) {
      return [];
    }

    // Fetch confirmed bookings for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: "CONFIRMED",
      },
      select: {
        timeSlot: true,
      },
    });

    // Create a set of occupied time slots (with buffer)
    const occupiedSlots = new Set<string>();

    existingBookings.forEach((booking) => {
      if (!booking.timeSlot) return;

      // Mark the booking time slot as occupied
      occupiedSlots.add(booking.timeSlot);

      // Also mark slots that would conflict (considering buffer time)
      const bookingTimeMinutes = timeToMinutes(booking.timeSlot);
      const slotEndMinutes = bookingTimeMinutes + slotDuration + bufferTime;

      for (const slot of allSlots) {
        const slotTimeMinutes = timeToMinutes(slot);
        // If slot starts before booking ends (with buffer), it conflicts
        if (
          slotTimeMinutes < slotEndMinutes &&
          slotTimeMinutes >= bookingTimeMinutes - bufferTime
        ) {
          occupiedSlots.add(slot);
        }
      }
    });

    // Filter out occupied slots
    const availableSlots = allSlots.filter((slot) => !occupiedSlots.has(slot));

    return availableSlots;
  } catch (error) {
    console.error("Error generating available slots:", error);
    return [];
  }
}

/**
 * Log a booking activity
 */
export async function logBookingActivity(
  bookingId: string,
  activity: string,
): Promise<void> {
  try {
    await prismaClient.bookingActivityLog.create({
      data: {
        bookingId,
        activity,
      },
    });
  } catch (error) {
    console.error("Error logging booking activity:", error);
  }
}
