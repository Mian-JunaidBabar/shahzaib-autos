/**
 * Order Server Actions
 *
 * RBAC-protected actions for order management.
 * Admin actions require authentication.
 * Public checkout action does NOT require admin auth.
 */

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/services/auth.service";
import * as OrderService from "@/lib/services/order.service";
import * as NotificationService from "@/lib/services/notification.service";
import {
  orderCreateSchema,
  orderUpdateSchema,
  orderFilterSchema,
  checkoutSchema,
  OrderCreateInput,
  OrderUpdateInput,
  OrderFilterInput,
  CheckoutInput,
} from "@/lib/validations";
import { generateWhatsAppUrl } from "@/lib/whatsapp";

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ============ Public Actions (No Admin Required) ============

/**
 * Generate unique order number with prefix SA-XXXX
 */
async function generateOrderNumber(): Promise<string> {
  // Get the count of existing orders to generate sequential number
  const count = await prisma.order.count();
  const orderNum = 1001 + count;
  return `SA-${orderNum}`;
}

/**
 * Create order from public checkout (NO ADMIN AUTH REQUIRED)
 * This is called by customers from the public storefront.
 *
 * Flow:
 * 1. Validate checkout data
 * 2. Generate order number (SA-1001, SA-1002, etc.)
 * 3. Inside a transaction:
 *    a. Create or update customer
 *    b. Create order with PENDING status
 *    c. Create order items
 *    d. Decrement inventory for each item
 * 4. Return order number and WhatsApp URL
 */
export async function createPublicOrderAction(
  input: CheckoutInput,
): Promise<
  ActionResult<{ orderNumber: string; orderId: string; whatsappUrl: string }>
> {
  try {
    // Validate input
    const validated = checkoutSchema.parse(input);
    const { customer, items } = validated;

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal;

    // Generate order number before transaction
    const orderNumber = await generateOrderNumber();

    // Execute everything in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Find or create customer by phone
      const customerRecord = await tx.customer.upsert({
        where: { phone: customer.phone },
        update: {
          name: customer.name,
          address: customer.address,
        },
        create: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
      });

      // 2. Check stock availability and get product details
      for (const item of items) {
        const inventory = await tx.inventory.findFirst({
          where: { product: { id: item.id } },
        });

        if (!inventory) {
          throw new Error(`Product "${item.name}" is not available`);
        }

        if (inventory.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for "${item.name}". Only ${inventory.quantity} available.`,
          );
        }
      }

      // 3. Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customerRecord.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          address: customer.address,
          subtotal,
          total,
          status: "NEW",
          items: {
            create: items.map((item) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 4. Decrement inventory for each item
      for (const item of items) {
        await tx.inventory.update({
          where: {
            productId: item.id,
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        // Update product status if out of stock
        const updatedInventory = await tx.inventory.findUnique({
          where: { productId: item.id },
        });

        if (updatedInventory && updatedInventory.quantity <= 0) {
          await tx.product.update({
            where: { id: item.id },
            data: { status: "OUT_OF_STOCK" },
          });
        }
      }

      return newOrder;
    });

    // Generate WhatsApp message with order details
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - PKR ${(item.price * item.quantity).toLocaleString()}`,
      )
      .join("\n");

    const message = `🛒 *New Order from Shahzaib Autos*

*Order #: ${orderNumber}*

*Customer Details:*
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}

*Order Items:*
${itemsList}

*Total: PKR ${total.toLocaleString()}*

Please confirm availability and delivery.`;

    const whatsappUrl = generateWhatsAppUrl(message);

    // Revalidate admin orders page
    revalidatePath("/admin/dashboard/orders");

    return {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        whatsappUrl,
      },
    };
  } catch (error) {
    console.error("createPublicOrderAction error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again.",
    };
  }
}

// ============ Admin Actions (Require Admin Auth) ============

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
