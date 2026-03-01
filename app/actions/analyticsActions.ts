"use server";

import { prisma } from "@/lib/prisma";

export async function getRevenueOverTime(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Raw query for grouping by date could be complex with Prisma if dates have times,
  // Let's fetch the orders and aggregate in JS for now as it's safe and flexible
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
      createdAt: { gte: cutoffDate },
    },
    select: {
      total: true,
      createdAt: true,
    },
  });

  // Group by date string (YYYY-MM-DD)
  const groupedData: Record<string, { revenue: number; orders: number }> = {};

  // Initialize all dates in the range to ensure zero fill
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    groupedData[dateStr] = { revenue: 0, orders: 0 };
  }

  orders.forEach((order) => {
    const dateStr = order.createdAt.toISOString().split("T")[0];
    if (groupedData[dateStr]) {
      groupedData[dateStr].revenue += order.total / 100; // Convert cents to dollars/rupees display unit
      groupedData[dateStr].orders += 1;
    }
  });

  return Object.entries(groupedData).map(([date, data]) => ({
    date,
    revenue: data.revenue,
    orders: data.orders,
  }));
}

export async function getTopSellingProducts() {
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId", "name"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  return topItems.map((item) => ({
    name: item.name,
    quantity: item._sum.quantity || 0,
    productId: item.productId,
  }));
}

export async function getBookingStatusDistribution() {
  const distribution = await prisma.booking.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  return distribution.map((item) => ({
    name: item.status,
    value: item._count.id,
  }));
}

export async function getDashboardSummary() {
  // Run queries sequentially to avoid opening many DB sessions at once
  const totalRevenueResult = await prisma.order.aggregate({
    where: {
      status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
    },
    _sum: {
      total: true,
    },
  });

  const pendingOrders = await prisma.order.count({
    where: { status: { in: ["NEW", "PROCESSING"] } },
  });

  const activeBookings = await prisma.booking.count({
    where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
  });

  const lowStockItems = await prisma.inventory.count({
    where: {
      quantity: { lte: 10 },
    },
  });

  return {
    totalRevenue: (totalRevenueResult._sum.total || 0) / 100, // Cents to main unit
    pendingOrders,
    activeBookings,
    lowStockItems,
  };
}

export async function getCustomerGrowth(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const customers = await prisma.customer.findMany({
    where: {
      createdAt: { gte: cutoffDate },
    },
    select: { createdAt: true },
  });

  const groupedData: Record<string, number> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    groupedData[dateStr] = 0;
  }

  customers.forEach((customer) => {
    const dateStr = customer.createdAt.toISOString().split("T")[0];
    if (dateStr in groupedData) {
      groupedData[dateStr] += 1;
    }
  });

  return Object.entries(groupedData).map(([date, newCustomers]) => ({
    date,
    newCustomers,
  }));
}

export async function getRevenueByCategory() {
  const orderItems = await prisma.orderItem.findMany({
    include: {
      product: { select: { category: true, price: true } },
    },
  });

  const categoryTotals: Record<string, number> = {};

  orderItems.forEach((item) => {
    const cat = item.product?.category || "Uncategorized";
    if (!categoryTotals[cat]) categoryTotals[cat] = 0;
    categoryTotals[cat] += (item.price * item.quantity) / 100;
  });

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

export async function getTopBookedServices() {
  const services = await prisma.booking.groupBy({
    by: ["serviceType"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });

  return services.map((s) => ({
    name: s.serviceType,
    bookings: s._count.id,
  }));
}

export async function getLowStockAlerts() {
  const alerts = await prisma.inventory.findMany({
    where: {
      quantity: { lte: 10 },
    },
    include: {
      product: { select: { name: true, sku: true } },
    },
    take: 5,
    orderBy: {
      quantity: "asc",
    },
  });

  return alerts.map((a) => ({
    id: a.id,
    name: a.product.name,
    sku: a.product.sku,
    quantity: a.quantity,
    threshold: a.lowStockAt,
  }));
}
