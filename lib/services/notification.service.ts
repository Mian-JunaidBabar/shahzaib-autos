/**
 * Notification Service
 *
 * Multi-channel notifications:
 * - WhatsApp message generation
 * - Email notifications (prepared for future)
 * - SMS notifications (prepared for future)
 */
import { Order, Booking, Lead, Customer } from "@prisma/client";


// Types
export type NotificationChannel = "whatsapp" | "email" | "sms";

export type NotificationResult = {
  success: boolean;
  channel: NotificationChannel;
  message?: string;
  url?: string;
  error?: string;
};

// WhatsApp configuration
const BUSINESS_PHONE = process.env.WHATSAPP_BUSINESS_PHONE || "";
const BUSINESS_NAME = "Shahzaib Autos";

/**
 * Generate WhatsApp URL with pre-filled message
 */
function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// ============ Order Notifications ============

// Matches Prisma OrderItem model (uses 'price' not 'unitPrice')
type OrderWithItems = Order & {
  items?: Array<{
    name: string;
    quantity: number;
    price: number; // Price per unit in cents
  }>;
  customer?: Customer | null;
};

/**
 * Generate order confirmation message
 */
export function generateOrderConfirmation(order: OrderWithItems): string {
  const itemsList =
    order.items
      ?.map(
        (item) =>
          `- ${item.name} x${item.quantity}: PKR ${item.price.toLocaleString()}`,
      )
      .join("\n") || "";

  return `🛒 *Order Confirmation*

Order #: ${order.orderNumber}
Date: ${order.createdAt.toLocaleDateString()}

*Customer Details:*
Name: ${order.customerName}
Phone: ${order.customerPhone}
${order.customerEmail ? `Email: ${order.customerEmail}` : ""}
${order.address ? `Address: ${order.address}` : ""}

*Order Items:*
${itemsList}

*Total: PKR ${order.total.toLocaleString()}*

Thank you for your order from ${BUSINESS_NAME}!
We will contact you shortly to confirm delivery.`;
}

/**
 * Generate order status update message
 */
export function generateOrderStatusUpdate(order: Order): string {
  const statusMessages: Record<string, string> = {
    NEW: "Your order has been received and is being processed.",
    CONFIRMED: "Your order has been confirmed!",
    PROCESSING: "Your order is being prepared.",
    SHIPPED: "Your order has been shipped!",
    DELIVERED: "Your order has been delivered. Thank you!",
    CANCELLED: "Your order has been cancelled.",
  };

  return `📦 *Order Update*

Order #: ${order.orderNumber}
Status: *${order.status}*

${statusMessages[order.status] || "Your order status has been updated."}

- ${BUSINESS_NAME}`;
}

/**
 * Send order notification via WhatsApp
 */
export function sendOrderNotification(
  order: OrderWithItems,
  type: "confirmation" | "status_update",
): NotificationResult {
  const message =
    type === "confirmation"
      ? generateOrderConfirmation(order)
      : generateOrderStatusUpdate(order);

  const url = generateWhatsAppUrl(order.customerPhone, message);

  return {
    success: true,
    channel: "whatsapp",
    message,
    url,
  };
}

// ============ Booking Notifications ============

type BookingWithCustomer = Booking & {
  customer?: Customer | null;
};

/**
 * Generate booking confirmation message
 */
export function generateBookingConfirmation(
  booking: BookingWithCustomer,
): string {
  return `📅 *Booking Confirmation*

Booking #: ${booking.bookingNumber}
Date: ${booking.date.toLocaleDateString()}
Time: ${booking.timeSlot || booking.date.toLocaleTimeString()}

*Customer Details:*
Name: ${booking.customerName}
Phone: ${booking.customerPhone}

*Service Details:*
Service: ${booking.serviceType}
${booking.vehicleInfo ? `Vehicle: ${booking.vehicleInfo}` : ""}
${booking.notes ? `Notes: ${booking.notes}` : ""}

Please arrive 10 minutes before your scheduled time.

- ${BUSINESS_NAME}`;
}

/**
 * Generate booking reminder message
 */
export function generateBookingReminder(booking: Booking): string {
  const date = booking.date.toLocaleDateString();
  const time = booking.timeSlot || booking.date.toLocaleTimeString();

  return `⏰ *Booking Reminder*

Hi ${booking.customerName}!

This is a reminder for your upcoming appointment:

Booking #: ${booking.bookingNumber}
Date: ${date}
Time: ${time}
Service: ${booking.serviceType}

Please arrive 10 minutes early.
If you need to reschedule, please contact us.

See you soon!
- ${BUSINESS_NAME}`;
}

/**
 * Generate booking status update message
 */
export function generateBookingStatusUpdate(booking: Booking): string {
  const statusMessages: Record<string, string> = {
    PENDING: "Your booking is pending confirmation.",
    CONFIRMED: "Your booking has been confirmed!",
    IN_PROGRESS: "Your service is now in progress.",
    COMPLETED: "Your service has been completed. Thank you!",
    CANCELLED: "Your booking has been cancelled.",
    NO_SHOW: "We missed you at your appointment.",
  };

  return `📋 *Booking Update*

Booking #: ${booking.bookingNumber}
Status: *${booking.status}*

${statusMessages[booking.status] || "Your booking status has been updated."}

- ${BUSINESS_NAME}`;
}

/**
 * Send booking notification via WhatsApp
 */
export function sendBookingNotification(
  booking: BookingWithCustomer,
  type: "confirmation" | "reminder" | "status_update",
): NotificationResult {
  let message: string;

  switch (type) {
    case "confirmation":
      message = generateBookingConfirmation(booking);
      break;
    case "reminder":
      message = generateBookingReminder(booking);
      break;
    case "status_update":
      message = generateBookingStatusUpdate(booking);
      break;
  }

  const url = generateWhatsAppUrl(booking.customerPhone, message);

  return {
    success: true,
    channel: "whatsapp",
    message,
    url,
  };
}

// ============ Lead Notifications ============

/**
 * Generate lead acknowledgment message
 */
export function generateLeadAcknowledgment(lead: Lead): string {
  return `👋 *Thank You for Contacting Us!*

Hi ${lead.name}!

We have received your inquiry regarding:
"${lead.message.substring(0, 100)}${lead.message.length > 100 ? "..." : ""}"

Our team will get back to you within 24 hours.

Best regards,
${BUSINESS_NAME}`;
}

/**
 * Generate internal lead notification
 */
export function generateLeadInternalNotification(lead: Lead): string {
  return `🔔 *New Lead Received*

Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "Not provided"}
Source: ${lead.source}

Message:
${lead.message}

---
Reply to this lead promptly!`;
}

/**
 * Send lead notification
 */
export function sendLeadNotification(
  lead: Lead,
  type: "customer_ack" | "internal",
): NotificationResult {
  const message =
    type === "customer_ack"
      ? generateLeadAcknowledgment(lead)
      : generateLeadInternalNotification(lead);

  const phone = type === "customer_ack" ? lead.phone : BUSINESS_PHONE;
  const url = generateWhatsAppUrl(phone, message);

  return {
    success: true,
    channel: "whatsapp",
    message,
    url,
  };
}

// ============ General Notifications ============

/**
 * Generate custom WhatsApp message
 */
export function generateCustomMessage(
  phone: string,
  message: string,
): NotificationResult {
  const url = generateWhatsAppUrl(phone, message);

  return {
    success: true,
    channel: "whatsapp",
    message,
    url,
  };
}

/**
 * Low stock alert for admin
 */
export function generateLowStockAlert(
  products: Array<{ name: string; stock: number; sku?: string | null }>,
): string {
  const productList = products
    .map((p) => `- ${p.name}${p.sku ? ` (${p.sku})` : ""}: ${p.stock} left`)
    .join("\n");

  return `⚠️ *Low Stock Alert*

The following products are running low:

${productList}

Please restock soon!

- ${BUSINESS_NAME} Inventory System`;
}

/**
 * Daily summary for admin
 */
export function generateDailySummary(stats: {
  newOrders: number;
  ordersTotal: number;
  newBookings: number;
  newLeads: number;
}): string {
  return `📊 *Daily Summary - ${new Date().toLocaleDateString()}*

📦 New Orders: ${stats.newOrders}
💰 Orders Total: PKR ${stats.ordersTotal.toLocaleString()}
📅 New Bookings: ${stats.newBookings}
📞 New Leads: ${stats.newLeads}

Have a productive day!
- ${BUSINESS_NAME} Dashboard`;
}
