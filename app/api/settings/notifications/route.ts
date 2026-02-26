import { requireAdmin } from "@/lib/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const prismaClient = prisma as any;

export async function GET() {
    try {
        await requireAdmin();

        let settings = await prismaClient.notificationSettings.findUnique({
            where: { id: 1 },
        });

        if (!settings) {
            settings = await prismaClient.notificationSettings.create({
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

        const settings = await prismaClient.notificationSettings.upsert({
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
