import { BookingStatus, Prisma } from "@prisma/client";
/**
 * Booking Service
 *
 * Business logic for booking management:
 * - Service appointment scheduling
 * - Status tracking
 * - Customer linking
 */
import { prisma } from "@/lib/prisma";


// Types
export type BookingWithCustomer = Prisma.BookingGetPayload<{
  include: { customer: true };
}>;

export type CreateBookingInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: string;
  vehicleInfo?: string;
  date: Date;
  timeSlot?: string;
  address: string;
  notes?: string;
};

export type UpdateBookingInput = {
  status?: BookingStatus;
  serviceType?: string;
  vehicleInfo?: string;
  date?: Date;
  timeSlot?: string;
  address?: string;
  notes?: string;
  whatsappSent?: boolean;
};

export type BookingFilters = {
  search?: string;
  status?: BookingStatus;
  dateFrom?: Date;
  dateTo?: Date;
  serviceType?: string;
};

/**
 * Generate unique booking number
 */
function generateBookingNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BKG-${year}${month}${day}-${random}`;
}

/**
 * Get paginated list of bookings
 */
export async function getBookings(
  filters: BookingFilters = {},
  pagination: { page?: number; limit?: number } = {},
) {
  const { search, status, dateFrom, dateTo, serviceType } = filters;
  const { page = 1, limit = 20 } = pagination;

  const where: Prisma.BookingWhereInput = {};

  if (search) {
    where.OR = [
      { bookingNumber: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
      { customerPhone: { contains: search } },
      { vehicleInfo: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom && { gte: dateFrom }),
      ...(dateTo && { lte: dateTo }),
    };
  }

  if (serviceType) {
    where.serviceType = serviceType;
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { customer: true },
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single booking by ID or booking number
 */
export async function getBooking(
  idOrNumber: string,
): Promise<BookingWithCustomer | null> {
  return prisma.booking.findFirst({
    where: {
      OR: [{ id: idOrNumber }, { bookingNumber: idOrNumber }],
    },
    include: { customer: true },
  });
}

/**
 * Create a new booking
 */
export async function createBooking(
  input: CreateBookingInput,
): Promise<BookingWithCustomer> {
  // Find or create customer
  let customerId: string | null = null;
  if (input.customerPhone) {
    const customer = await prisma.customer.upsert({
      where: { phone: input.customerPhone },
      update: {
        name: input.customerName,
        email: input.customerEmail || undefined,
        address: input.address || undefined,
      },
      create: {
        name: input.customerName,
        phone: input.customerPhone,
        email: input.customerEmail,
        address: input.address,
      },
    });
    customerId = customer.id;
  }

  return prisma.booking.create({
    data: {
      bookingNumber: generateBookingNumber(),
      customerId,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      serviceType: input.serviceType,
      vehicleInfo: input.vehicleInfo,
      date: input.date,
      timeSlot: input.timeSlot,
      address: input.address,
      notes: input.notes,
    },
    include: { customer: true },
  });
}

/**
 * Update a booking
 */
export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<BookingWithCustomer> {
  return prisma.booking.update({
    where: { id },
    data: input,
    include: { customer: true },
  });
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  notes?: string,
): Promise<BookingWithCustomer> {
  return updateBooking(id, { status, ...(notes && { notes }) });
}

/**
 * Reschedule booking
 */
export async function rescheduleBooking(
  id: string,
  date: Date,
): Promise<BookingWithCustomer> {
  return updateBooking(id, { date });
}

/**
 * Get booking statistics
 */
export async function getBookingStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [total, byStatus, todayCount, upcomingCount] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.booking.count({
      where: {
        date: { gte: today, lt: tomorrow },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    }),
    prisma.booking.count({
      where: {
        date: { gte: today },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    }),
  ]);

  return {
    total,
    byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
    todayBookings: todayCount,
    upcomingBookings: upcomingCount,
    pendingBookings:
      byStatus.find((s) => s.status === BookingStatus.PENDING)?._count || 0,
  };
}

/**
 * Get upcoming bookings
 */
export async function getUpcomingBookings(
  limit = 5,
): Promise<BookingWithCustomer[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.booking.findMany({
    where: {
      date: { gte: today },
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    },
    include: { customer: true },
    orderBy: { date: "asc" },
    take: limit,
  });
}

/**
 * Get all unique service types
 */
export async function getServiceTypes(): Promise<string[]> {
  const services = await prisma.booking.findMany({
    select: { serviceType: true },
    distinct: ["serviceType"],
  });

  return services.map((s) => s.serviceType);
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: string): Promise<void> {
  await prisma.booking.delete({ where: { id } });
}
