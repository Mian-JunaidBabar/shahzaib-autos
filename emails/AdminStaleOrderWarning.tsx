/**
 * Admin Stale Order Warning Email Template
 *
 * Sent to admin when orders have been in NEW status for over 24 hours.
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

interface StaleOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  createdAt: Date;
}

interface AdminStaleOrderWarningProps {
  staleOrders: StaleOrder[];
  adminUrl: string;
}

export function AdminStaleOrderWarning({
  staleOrders,
  adminUrl,
}: AdminStaleOrderWarningProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAge = (date: Date) => {
    const hours = Math.floor(
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60),
    );
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <Html>
      <Head />
      <Preview>
        {`🚨 Action Required: ${staleOrders.length} stale order${staleOrders.length > 1 ? "s" : ""} need attention`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🚨 Stale Orders Alert</Heading>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBox}>
            <Text style={alertTitle}>
              {staleOrders.length} Order{staleOrders.length > 1 ? "s" : ""}{" "}
              Require Immediate Attention
            </Text>
            <Text style={alertSubtext}>
              These orders have been waiting for more than 24 hours without
              being processed.
            </Text>
          </Section>

          {/* Orders List */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Stale Orders
            </Heading>

            {staleOrders.map((order, index) => (
              <Section key={order.id} style={orderCard}>
                <Section style={orderHeader}>
                  <Text style={orderNumber}>#{order.orderNumber}</Text>
                  <Text style={orderAge}>{formatAge(order.createdAt)}</Text>
                </Section>

                <Text style={customerInfo}>
                  <strong>Customer:</strong> {order.customerName}
                </Text>
                <Text style={customerInfo}>
                  <strong>Phone:</strong> {order.customerPhone}
                </Text>
                <Text style={orderTotal}>
                  <strong>Total:</strong> PKR {order.total.toLocaleString()}
                </Text>
                <Text style={orderDate}>
                  <strong>Created:</strong> {formatDate(order.createdAt)}
                </Text>

                {index < staleOrders.length - 1 && <Hr style={orderDivider} />}
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Actions Section */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Recommended Actions
            </Heading>
            <Text style={actionItem}>
              ✅ Contact each customer immediately to confirm their order
            </Text>
            <Text style={actionItem}>
              📞 Call or WhatsApp to check if they still need the items
            </Text>
            <Text style={actionItem}>
              📝 Update order status after contacting customers
            </Text>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={adminUrl}>
              View All Orders in Dashboard
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This is an automated daily alert from Shahzaib Autos.
            </Text>
            <Text style={footerText}>
              Orders left unprocessed may result in lost sales and unhappy
              customers.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminStaleOrderWarning;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#dc2626",
  padding: "24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const h2 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const section = {
  padding: "24px",
};

const alertBox = {
  backgroundColor: "#fef2f2",
  borderLeft: "4px solid #dc2626",
  padding: "20px 24px",
  margin: "0",
};

const alertTitle = {
  color: "#991b1b",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const alertSubtext = {
  color: "#b91c1c",
  fontSize: "14px",
  margin: "0",
};

const orderCard = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
  border: "1px solid #e5e7eb",
};

const orderHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const orderNumber = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
};

const orderAge = {
  color: "#dc2626",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: "#fef2f2",
  padding: "4px 8px",
  borderRadius: "4px",
  margin: "0",
};

const customerInfo = {
  color: "#4b5563",
  fontSize: "14px",
  margin: "4px 0",
};

const orderTotal = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "600",
  margin: "8px 0 4px",
};

const orderDate = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
};

const orderDivider = {
  borderColor: "#e5e7eb",
  margin: "12px 0 0",
};

const actionItem = {
  color: "#374151",
  fontSize: "14px",
  margin: "8px 0",
  paddingLeft: "8px",
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
  backgroundColor: "#dc2626",
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
  backgroundColor: "#fef2f2",
  padding: "20px 24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#b91c1c",
  fontSize: "12px",
  margin: "4px 0",
};
