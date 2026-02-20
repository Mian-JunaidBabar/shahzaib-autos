/**
 * Admin New Order Alert Email Template
 *
 * Sent to admin when a new order is placed from the public storefront.
 */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface AdminNewOrderAlertProps {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  adminUrl: string;
  createdAt?: Date;
}

export function AdminNewOrderAlert({
  orderNumber,
  customerName,
  customerPhone,
  customerAddress,
  items,
  subtotal,
  total,
  adminUrl,
  createdAt = new Date(),
}: AdminNewOrderAlertProps) {
  const formattedDate = createdAt.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>
        🛒 New Order #{orderNumber} from {customerName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🛒 New Order Received</Heading>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBox}>
            <Text style={alertText}>
              You have a new order that requires attention!
            </Text>
          </Section>

          {/* Order Details */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Order Details
            </Heading>
            <Text style={infoRow}>
              <strong>Order Number:</strong> #{orderNumber}
            </Text>
            <Text style={infoRow}>
              <strong>Date:</strong> {formattedDate}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Customer Info */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Customer Information
            </Heading>
            <Text style={infoRow}>
              <strong>Name:</strong> {customerName}
            </Text>
            <Text style={infoRow}>
              <strong>Phone:</strong> {customerPhone}
            </Text>
            {customerAddress && (
              <Text style={infoRow}>
                <strong>Address:</strong> {customerAddress}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Order Items
            </Heading>
            {items.map((item, index) => (
              <Text key={index} style={itemRow}>
                {item.name} × {item.quantity} — PKR{" "}
                {(item.price * item.quantity).toLocaleString()}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totals */}
          <Section style={section}>
            <Text style={infoRow}>
              <strong>Subtotal:</strong> PKR {subtotal.toLocaleString()}
            </Text>
            <Text style={totalRow}>
              <strong>Total:</strong> PKR {total.toLocaleString()}
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={adminUrl}>
              View Order in Dashboard
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Shahzaib Autos.
            </Text>
            <Text style={footerText}>
              Please contact the customer promptly to confirm the order.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNewOrderAlert;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#1f2937",
  padding: "24px",
  borderRadius: "8px 8px 0 0",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const section = {
  padding: "24px",
};

const alertBox = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "16px 24px",
  margin: "0",
};

const alertText = {
  color: "#92400e",
  fontSize: "14px",
  margin: "0",
  fontWeight: "500",
};

const infoRow = {
  color: "#374151",
  fontSize: "14px",
  margin: "4px 0",
};

const itemRow = {
  color: "#374151",
  fontSize: "14px",
  margin: "8px 0",
  paddingLeft: "12px",
  borderLeft: "2px solid #e5e7eb",
};

const totalRow = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "8px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const buttonSection = {
  padding: "24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "24px",
  borderRadius: "0 0 8px 8px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "4px 0",
  textAlign: "center" as const,
};
