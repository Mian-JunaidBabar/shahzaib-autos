import {
  sendEmailAsync,
  sendEmail,
  adminEmail,
} from "@/lib/services/mail.service";
import NewsletterWelcome from "@/emails/NewsletterWelcome";
import { prisma } from "@/lib/prisma";
import React from "react";

export async function subscribeEmail(
  email: string,
  opts?: { source?: string; ip?: string; userAgent?: string },
) {
  // Upsert subscriber: create if not exists, otherwise set subscribed=true
  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      subscribed: true,
      subscribedAt: new Date(),
      source: opts?.source,
      ipAddress: opts?.ip,
      userAgent: opts?.userAgent,
    },
    create: {
      email,
      subscribed: true,
      subscribedAt: new Date(),
      source: opts?.source,
      ipAddress: opts?.ip,
      userAgent: opts?.userAgent,
    },
  });

  // Attempt to send welcome email. In development/sandbox Resend may reject
  // sends to arbitrary recipients; if that happens, fallback to notifying admin
  // so you still get notified about new subscribers.
  try {
    const result = await sendEmail({
      to: subscriber.email,
      subject: "Thanks for signing up — welcome to Shahzaib Autos!",
      react: React.createElement(NewsletterWelcome, {
        recipientEmail: subscriber.email,
      }),
      replyTo: adminEmail,
    });

    if (!result.success) {
      console.error("Welcome email failed:", result.error);
      // Fallback: inform admin about new subscriber and include target email
      await sendEmailAsync({
        to: adminEmail,
        subject: `Delivery fallback: new subscriber ${subscriber.email}`,
        react: React.createElement(NewsletterWelcome, {
          recipientEmail: subscriber.email,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        }),
        replyTo: adminEmail,
      });
    }
  } catch (err) {
    console.error("Failed to send welcome email (exception):", err);
    // Always attempt to notify admin on unexpected failures
    try {
      await sendEmailAsync({
        to: adminEmail,
        subject: `Delivery exception for subscriber ${subscriber.email}`,
        react: React.createElement(NewsletterWelcome, {
          recipientEmail: subscriber.email,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        }),
        replyTo: adminEmail,
      });
    } catch (e) {
      console.error("Failed to enqueue admin fallback email:", e);
    }
  }

  return subscriber;
}

export async function unsubscribeEmail(email: string) {
  return prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: { subscribed: false, unsubscribedAt: new Date() },
  });
}
