import type { Customer, Order, Booking } from "@prisma/client";
import { Prisma } from "@prisma/client";
/**
 * Customer Service
 *
 * Business logic for customer management:
 * - Customer profiles
 * - Order/Booking history linking
 * - VIP status management
 */
import { prisma } from "@/lib/prisma";

// Types
export type CustomerWithHistory = Customer & {
  orders?: Order[];
  bookings?: Booking[];
  _count?: { orders: number; bookings: number };
};

export type CreateCustomerInput = {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
  isVip?: boolean;
};

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export type CustomerFilters = {
  search?: string;
  isVip?: boolean;
};

/**
 * Get paginated list of customers
 */
export async function getCustomers(
  filters: CustomerFilters = {},
  pagination: { page?: number; limit?: number } = {},
) {
  const { search, isVip } = filters;
  const { page = 1, limit = 20 } = pagination;

  const where: Prisma.CustomerWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  if (typeof isVip === "boolean") {
    where.isVip = isVip;
  }

  const customers = await prisma.customer.findMany({
    where,
    include: {
      _count: {
        select: { orders: true, bookings: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.customer.count({ where });

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single customer by ID, email, or phone
 */
export async function getCustomer(
  identifier: string,
): Promise<CustomerWithHistory | null> {
  return prisma.customer.findFirst({
    where: {
      OR: [{ id: identifier }, { email: identifier }, { phone: identifier }],
    },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
}

/**
 * Create a new customer
 */
export async function createCustomer(
  input: CreateCustomerInput,
): Promise<CustomerWithHistory> {
  return prisma.customer.create({
    data: input,
    include: {
      orders: true,
      bookings: true,
    },
  });
}

/**
 * Update a customer
 */
export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<CustomerWithHistory> {
  return prisma.customer.update({
    where: { id },
    data: input,
    include: {
      orders: true,
      bookings: true,
    },
  });
}

/**
 * Delete a customer (soft delete recommended, but using hard delete for now)
 */
export async function deleteCustomer(id: string): Promise<void> {
  await prisma.customer.delete({ where: { id } });
}

/**
 * Toggle VIP status
 */
export async function toggleVipStatus(
  id: string,
): Promise<CustomerWithHistory> {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw new Error("Customer not found");

  return prisma.customer.update({
    where: { id },
    data: { isVip: !customer.isVip },
    include: {
      orders: true,
      bookings: true,
    },
  });
}

/**
 * Get customer statistics
 */
export async function getCustomerStats() {
  const total = await prisma.customer.count();
  const vipCount = await prisma.customer.count({ where: { isVip: true } });
  const recentCount = await prisma.customer.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    total,
    vipCount,
    recentCount,
  };
}

/**
 * Find or create customer by phone
 */
export async function findOrCreateCustomer(
  phone: string,
  data: Omit<CreateCustomerInput, "phone">,
): Promise<CustomerWithHistory> {
  return prisma.customer.upsert({
    where: { phone },
    update: {
      name: data.name,
      email: data.email || undefined,
      address: data.address || undefined,
    },
    create: {
      phone,
      name: data.name,
      email: data.email,
      address: data.address,
      notes: data.notes,
    },
    include: {
      orders: true,
      bookings: true,
    },
  });
}

/**
 * Get customer history (orders and bookings)
 */
export async function getCustomerHistory(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return {
    orders: customer.orders,
    bookings: customer.bookings,
    totalOrders: customer.orders.length,
    totalBookings: customer.bookings.length,
  };
}
