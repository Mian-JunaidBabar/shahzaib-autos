/**
 * Admin New Lead Alert Email Template
 *
 * Sent to admin when a new contact lead is submitted from the public site.
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

interface AdminNewLeadAlertProps {
  leadName: string;
  leadEmail?: string | null;
  leadPhone?: string | null;
  leadMessage?: string | null;
  leadSource: string;
  createdAt?: Date;
  adminUrl: string;
}

export function AdminNewLeadAlert({
  leadName,
  leadEmail,
  leadPhone,
  leadMessage,
  leadSource,
  createdAt = new Date(),
  adminUrl,
}: AdminNewLeadAlertProps) {
  const formattedDate = createdAt.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>New contact lead from {leadName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>New Lead Received</Heading>
          </Section>

          <Section style={alertBox}>
            <Text style={alertText}>
              A new customer inquiry needs your attention.
            </Text>
          </Section>

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Lead Details
            </Heading>
            <Text style={infoRow}>
              <strong>Name:</strong> {leadName}
            </Text>
            <Text style={infoRow}>
              <strong>Email:</strong> {leadEmail || "Not provided"}
            </Text>
            <Text style={infoRow}>
              <strong>Phone:</strong> {leadPhone || "Not provided"}
            </Text>
            <Text style={infoRow}>
              <strong>Source:</strong> {leadSource}
            </Text>
            <Text style={infoRow}>
              <strong>Submitted At:</strong> {formattedDate}
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Heading as="h2" style={h2}>
              Message
            </Heading>
            <Text style={messageBox}>
              {leadMessage || "No message provided."}
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={adminUrl}>
              View Lead in Dashboard
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from Shahzaib Electronics.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNewLeadAlert;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 40px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#111827",
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
  color: "#111827",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const section = {
  padding: "20px 24px",
};

const alertBox = {
  backgroundColor: "#fff7ed",
  borderLeft: "4px solid #f97316",
  padding: "14px 24px",
};

const alertText = {
  color: "#9a3412",
  fontSize: "14px",
  margin: "0",
  fontWeight: "500",
};

const infoRow = {
  color: "#374151",
  fontSize: "14px",
  margin: "6px 0",
};

const messageBox = {
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "1.6",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "12px",
  margin: "0",
};

const buttonSection = {
  padding: "8px 24px 24px",
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
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "18px 24px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
  textAlign: "center" as const,
};
