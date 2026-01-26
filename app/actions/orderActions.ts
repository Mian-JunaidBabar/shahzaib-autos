/**
 * Order Server Actions
 *
 * RBAC-protected actions for order management.
 * All actions require admin authentication.
 */

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/services/auth.service";
import * as OrderService from "@/lib/services/order.service";
import * as NotificationService from "@/lib/services/notification.service";
import {
  orderCreateSchema,
  orderUpdateSchema,
  orderFilterSchema,
  OrderCreateInput,
  OrderUpdateInput,
  OrderFilterInput,
} from "@/lib/validations";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get orders with filters and pagination
 */
export async function getOrdersAction(
  input: OrderFilterInput,
): Promise<ActionResult<Awaited<ReturnType<typeof OrderService.getOrders>>>> {
  try {
    await requireAdmin();

    const validated = orderFilterSchema.parse(input);
    const result = await OrderService.getOrders(validated);

    return { success: true, data: result };
  } catch (error) {
    console.error("getOrdersAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

/**
 * Get single order by ID
 */
export async function getOrderAction(
  id: string,
): Promise<ActionResult<Awaited<ReturnType<typeof OrderService.getOrder>>>> {
  try {
    await requireAdmin();

    const order = await OrderService.getOrder(id);
    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, data: order };
  } catch (error) {
    console.error("getOrderAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
  }
}

/**
 * Create new order
 */
export async function createOrderAction(
  input: OrderCreateInput,
): Promise<ActionResult<{ id: string; whatsappUrl?: string }>> {
  try {
    await requireAdmin();

    const validated = orderCreateSchema.parse(input);
    const order = await OrderService.createOrder(validated);

    // Generate WhatsApp notification URL
    const orderWithItems = {
      ...order,
      items: validated.items,
    };
    const notification = NotificationService.sendOrderNotification(
      orderWithItems,
      "confirmation",
    );

    revalidatePath("/admin/dashboard/orders");

    return {
      success: true,
      data: { id: order.id, whatsappUrl: notification.url },
    };
  } catch (error) {
    console.error("createOrderAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatusAction(
  input: OrderUpdateInput,
): Promise<ActionResult<{ whatsappUrl?: string }>> {
  try {
    await requireAdmin();

    const validated = orderUpdateSchema.parse(input);
    const order = await OrderService.updateOrderStatus(
      validated.id,
      validated.status,
      validated.notes,
    );

    // Generate WhatsApp notification URL
    const notification = NotificationService.sendOrderNotification(
      order,
      "status_update",
    );

    revalidatePath("/admin/dashboard/orders");
    revalidatePath(`/admin/dashboard/orders/${validated.id}`);

    return { success: true, data: { whatsappUrl: notification.url } };
  } catch (error) {
    console.error("updateOrderStatusAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order",
    };
  }
}

/**
 * Delete order
 */
export async function deleteOrderAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    await OrderService.deleteOrder(id);

    revalidatePath("/admin/dashboard/orders");

    return { success: true };
  } catch (error) {
    console.error("deleteOrderAction error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}

/**
 * Get order statistics
 */
export async function getOrderStatsAction(): Promise<
  ActionResult<Awaited<ReturnType<typeof OrderService.getOrderStats>>>
> {
  try {
    await requireAdmin();

    const stats = await OrderService.getOrderStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("getOrderStatsAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch order stats",
    };
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrdersAction(
  limit: number = 5,
): Promise<
  ActionResult<Awaited<ReturnType<typeof OrderService.getRecentOrders>>>
> {
  try {
    await requireAdmin();

    const orders = await OrderService.getRecentOrders(limit);
    return { success: true, data: orders };
  } catch (error) {
    console.error("getRecentOrdersAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch recent orders",
    };
  }
}
