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
        }
    });

    // Group by date string (YYYY-MM-DD)
    const groupedData: Record<string, { revenue: number, orders: number }> = {};

    // Initialize all dates in the range to ensure zero fill
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        groupedData[dateStr] = { revenue: 0, orders: 0 };
    }

    orders.forEach(order => {
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
        by: ['productId', 'name'],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 5,
    });

    return topItems.map(item => ({
        name: item.name,
        quantity: item._sum.quantity || 0,
        productId: item.productId,
    }));
}

export async function getBookingStatusDistribution() {
    const distribution = await prisma.booking.groupBy({
        by: ['status'],
        _count: {
            id: true,
        },
    });

    return distribution.map(item => ({
        name: item.status,
        value: item._count.id,
    }));
}

export async function getDashboardSummary() {
    const [totalRevenueResult, pendingOrders, activeBookings, lowStockItems] = await Promise.all([
        prisma.order.aggregate({
            where: {
                status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] },
            },
            _sum: {
                total: true,
            },
        }),
        prisma.order.count({
            where: { status: { in: ["NEW", "PROCESSING"] } },
        }),
        prisma.booking.count({
            where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
        }),
        prisma.inventory.count({
            where: {
                quantity: { lte: 10 }, // Can't easily use column comparison in Prisma count yet, assuming default 10 or using a raw query.
            },
        }),
    ]);

    return {
        totalRevenue: (totalRevenueResult._sum.total || 0) / 100, // Cents to main unit
        pendingOrders,
        activeBookings,
        lowStockItems,
    };
}
