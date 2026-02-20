/**
 * Customer Order Confirmation Email Template
 *
 * Sent to customers after they place an order on the storefront.
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

interface CustomerOrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  address?: string;
  storeUrl?: string;
}

export function CustomerOrderConfirmation({
  customerName,
  orderNumber,
  items,
  subtotal,
  total,
  address,
  storeUrl = "https://shahzaibautos.com",
}: CustomerOrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Order Confirmed! Your Shahzaib Autos order #{orderNumber} has been
        received.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✅ Order Confirmed!</Heading>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Text style={greeting}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Thank you for your order! We&apos;ve received your order and our
              team will review it shortly. We&apos;ll contact you soon to
              confirm availability and arrange delivery.
            </Text>
          </Section>

          {/* Order Info */}
          <Section style={orderBox}>
            <Text style={orderLabel}>Order Number</Text>
            <Text style={orderNumberStyle}>#{orderNumber}</Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Your Order
            </Heading>
            {items.map((item, index) => (
              <Section key={index} style={itemContainer}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemDetails}>
                  Qty: {item.quantity} × PKR {item.price.toLocaleString()} = PKR{" "}
                  {(item.price * item.quantity).toLocaleString()}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Totals */}
          <Section style={totalsSection}>
            <Text style={subtotalRow}>
              <span>Subtotal:</span>
              <span>PKR {subtotal.toLocaleString()}</span>
            </Text>
            <Text style={totalRowStyle}>
              <span>Total:</span>
              <span>PKR {total.toLocaleString()}</span>
            </Text>
          </Section>

          {address && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading as="h2" style={h2}>
                  Delivery Address
                </Heading>
                <Text style={paragraph}>{address}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />

          {/* What's Next */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              What&apos;s Next?
            </Heading>
            <Text style={paragraph}>
              <strong>1. Review:</strong> Our team will review your order and
              check stock availability.
            </Text>
            <Text style={paragraph}>
              <strong>2. Confirmation:</strong> We&apos;ll call or WhatsApp you
              to confirm details and delivery time.
            </Text>
            <Text style={paragraph}>
              <strong>3. Delivery:</strong> Your parts will be delivered to your
              specified address.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={buttonSection}>
            <Button style={button} href={storeUrl}>
              Continue Shopping
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerHeading}>Need Help?</Text>
            <Text style={footerText}>
              Contact us on WhatsApp: +92 337 499 0542
            </Text>
            <Text style={footerText}>Email: support@shahzaibautos.com</Text>
            <Hr style={footerHr} />
            <Text style={copyright}>
              © {new Date().getFullYear()} Shahzaib Autos. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default CustomerOrderConfirmation;

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
  backgroundColor: "#059669",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
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

const greeting = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const orderBox = {
  backgroundColor: "#f0fdf4",
  padding: "24px",
  textAlign: "center" as const,
};

const orderLabel = {
  color: "#6b7280",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 4px",
};

const orderNumberStyle = {
  color: "#059669",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const itemContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "12px 16px",
  marginBottom: "8px",
};

const itemName = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const itemDetails = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0",
};

const totalsSection = {
  padding: "24px",
  backgroundColor: "#f9fafb",
};

const subtotalRow = {
  color: "#6b7280",
  fontSize: "14px",
  display: "flex",
  justifyContent: "space-between",
  margin: "0 0 8px",
};

const totalRowStyle = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "space-between",
  margin: "0",
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
  backgroundColor: "#1f2937",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  backgroundColor: "#1f2937",
  padding: "24px",
  textAlign: "center" as const,
};

const footerHeading = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "13px",
  margin: "4px 0",
};

const footerHr = {
  borderColor: "#374151",
  margin: "16px 0",
};

const copyright = {
  color: "#6b7280",
  fontSize: "11px",
  margin: "0",
};
