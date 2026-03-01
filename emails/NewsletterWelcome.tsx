import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text, } from "@react-email/components";
import * as React from "react";


export interface NewsletterWelcomeProps {
  recipientEmail?: string;
  siteUrl?: string;
}

export default function NewsletterWelcome({
  recipientEmail,
  siteUrl = "https://shahzaibautos.com" || "https://shahzaib-autos.vercel.app",
}: NewsletterWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for signing up — welcome to Shahzaib Autos</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Welcome to Shahzaib Autos</Heading>
          </Section>

          <Section style={section}>
            <Text style={greeting}>
              Hi{recipientEmail ? `, ${recipientEmail}` : ""},
            </Text>
            <Text style={paragraph}>
              Thanks for signing up to the Shahzaib Autos newsletter. We&apos;re
              thrilled to have you — expect vehicle tips, parts deals, and early
              access to new arrivals.
            </Text>

            <Text style={paragraph}>
              Meanwhile, explore our latest parts and services:
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={siteUrl}>
                Visit Shahzaib Autos
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={small}>
              You can unsubscribe anytime using the link in our emails.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Shahzaib Autos
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
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

const buttonSection = {
  padding: "16px 0",
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

const hr = { borderColor: "#e5e7eb", margin: "16px 0" };
const small = { color: "#6b7280", fontSize: "12px" };
const footer = {
  backgroundColor: "#ffffff",
  padding: "16px",
  textAlign: "center" as const,
};
const footerText = { color: "#9ca3af", fontSize: "12px" };
