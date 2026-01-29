/**
 * Booking Server Actions
 *
 * RBAC-protected actions for booking management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/services/auth.service";
import * as BookingService from "@/lib/services/booking.service";
import * as NotificationService from "@/lib/services/notification.service";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingFilterSchema,
  BookingCreateInput,
  BookingUpdateInput,
  BookingFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get bookings with filters and pagination
 */
export async function getBookingsAction(
  input: BookingFilterInput,
): Promise<
  ActionResult<Awaited<ReturnType<typeof BookingService.getBookings>>>
> {
  try {
    await requireAdmin();

    const validated = bookingFilterSchema.parse(input);
    const result = await BookingService.getBookings(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getBookingsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch bookings",
    };
  }
}

/**
 * Get single booking by ID
 */
export async function getBookingAction(
  id: string,
): Promise<
  ActionResult<Awaited<ReturnType<typeof BookingService.getBooking>>>
> {
  try {
    await requireAdmin();

    const booking = await BookingService.getBooking(id);
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return { success: true, data: booking };
  } catch (error) {
    console.error("getBookingAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch booking",
    };
  }
}

/**
 * Create new booking
 */
export async function createBookingAction(
  input: BookingCreateInput,
): Promise<ActionResult<{ id: string; whatsappUrl?: string }>> {
  try {
    await requireAdmin();

    const validated = bookingCreateSchema.parse(input);
    const booking = await BookingService.createBooking(validated);

    // Generate WhatsApp notification URL
    const notification = NotificationService.sendBookingNotification(
      booking,
      "confirmation",
    );

    revalidatePath("/admin/dashboard/bookings");

    return {
      success: true,
      data: { id: booking.id, whatsappUrl: notification.url },
    };
  } catch (error) {
    console.error("createBookingAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatusAction(
  input: BookingUpdateInput | string,
  status?: string,
  reschedule?: { date: string; timeSlot: string },
): Promise<ActionResult<{ whatsappUrl?: string }>> {
  try {
    await requireAdmin();

    let id: string;
    let newStatus: string;

    // Handle both old and new call signatures
    if (typeof input === "string") {
      id = input;
      newStatus = status || "PENDING";
    } else {
      const validated = bookingUpdateSchema.parse(input);
      id = validated.id;
      newStatus = validated.status;
    }

    const updateData: Record<string, unknown> = { status: newStatus };
    if (reschedule) {
      updateData.date = new Date(reschedule.date);
      updateData.timeSlot = reschedule.timeSlot;
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { customer: true },
    });

    const { logBookingActivity } = await import("@/lib/services/slot.service");
    const activity = reschedule
      ? `Rescheduled to ${new Date(reschedule.date).toLocaleDateString()} at ${reschedule.timeSlot}`
      : `Status changed to ${newStatus}`;
    await logBookingActivity(id, activity);

    // Generate WhatsApp notification URL
    const notification = NotificationService.sendBookingNotification(
      booking,
      "status_update",
    );

    revalidatePath("/admin/dashboard/bookings");
    revalidatePath(`/admin/dashboard/bookings/${id}`);

    return { success: true, data: { whatsappUrl: notification.url } };
  } catch (error) {
    console.error("updateBookingStatusAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update booking",
    };
  }
}

/**
 * Reschedule booking
 */
export async function rescheduleBookingAction(
  id: string,
  date: Date,
  timeSlot?: string,
): Promise<ActionResult<{ whatsappUrl?: string }>> {
  try {
    await requireAdmin();

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        date,
        timeSlot: timeSlot || undefined,
      },
      include: { customer: true },
    });

    const { logBookingActivity } = await import("@/lib/services/slot.service");
    await logBookingActivity(
      id,
      `Rescheduled to ${date.toLocaleDateString()} at ${timeSlot || "TBD"}`,
    );

    // Generate WhatsApp notification URL
    const notification = NotificationService.sendBookingNotification(
      booking,
      "confirmation",
    );

    revalidatePath("/admin/dashboard/bookings");
    revalidatePath(`/admin/dashboard/bookings/${id}`);

    return { success: true, data: { whatsappUrl: notification.url } };
  } catch (error) {
    console.error("rescheduleBookingAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reschedule booking",
    };
  }
}

/**
 * Delete booking
 */
export async function deleteBookingAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await BookingService.deleteBooking(id);

    revalidatePath("/admin/dashboard/bookings");

    return { success: true };
  } catch (error) {
    console.error("deleteBookingAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete booking",
    };
  }
}

/**
 * Get booking statistics
 */
export async function getBookingStatsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof BookingService.getBookingStats>>>
> {
  try {
    await requireAdmin();

    const stats = await BookingService.getBookingStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("getBookingStatsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch booking stats",
    };
  }
}

/**
 * Get upcoming bookings
 */
export async function getUpcomingBookingsAction(
  limit: number = 5,
): Promise<
  ActionResult<Awaited<ReturnType<typeof BookingService.getUpcomingBookings>>>
> {
  try {
    await requireAdmin();

    const bookings = await BookingService.getUpcomingBookings(limit);
    return { success: true, data: bookings };
  } catch (error) {
    console.error("getUpcomingBookingsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch upcoming bookings",
    };
  }
}

/**
 * Get service types
 */
export async function getServiceTypesAction(): Promise<ActionResult<string[]>> {
  try {
    await requireAdmin();

    const types = await BookingService.getServiceTypes();
    return { success: true, data: types };
  } catch (error) {
    console.error("getServiceTypesAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch service types",
    };
  }
}

/**
 * Send booking reminder
 */
export async function sendBookingReminderAction(
  id: string,
): Promise<ActionResult<{ whatsappUrl: string }>> {
  try {
    await requireAdmin();

    const booking = await BookingService.getBooking(id);
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const notification = NotificationService.sendBookingNotification(
      booking,
      "reminder",
    );

    return { success: true, data: { whatsappUrl: notification.url! } };
  } catch (error) {
    console.error("sendBookingReminderAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate reminder",
    };
  }
}

/**
 * Create a booking from public booking form (no auth required)
 */
export async function createPublicBookingAction(input: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  date: string;
  timeSlot: string;
  vehicleInfo?: string;
  serviceIds: string[];
  notes?: string;
}): Promise<
  ActionResult<{
    bookingNumber: string;
    whatsappUrl: string;
  }>
> {
  try {
    // Get service titles
    const services = await Promise.all(
      input.serviceIds.map((id) =>
        prisma.service.findUnique({
          where: { id },
          select: { title: true },
        }),
      ),
    );

    const serviceType = services
      .filter((s) => s !== null)
      .map((s) => s!.title)
      .join(", ");

    // Create booking
    const booking = await BookingService.createBooking({
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      address: input.address,
      date: new Date(input.date),
      timeSlot: input.timeSlot,
      vehicleInfo: input.vehicleInfo,
      serviceType,
      notes: input.notes,
    });

    // Generate WhatsApp notification
    const notification = NotificationService.sendBookingNotification(
      booking,
      "confirmation",
    );

    // Revalidate admin pages
    revalidatePath("/admin/dashboard/bookings");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: {
        bookingNumber: booking.bookingNumber,
        whatsappUrl: notification.url!,
      },
    };
  } catch (error) {
    console.error("createPublicBookingAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

/**
 * Get available time slots for a specific date
 * Public action - no authentication required for customer-facing bookings
 */
export async function getAvailableSlotsAction(
  date: string,
): Promise<ActionResult<string[]>> {
  try {
    const { getAvailableSlots } = await import("@/lib/services/slot.service");
    const slots = await getAvailableSlots(new Date(date));
    return { success: true, data: slots };
  } catch (error) {
    console.error("getAvailableSlotsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch available slots",
    };
  }
}
