import { sendEmailAsync } from "@/lib/services/mail.service";
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

  // Send welcome email asynchronously
  try {
    sendEmailAsync({
      to: subscriber.email,
      subject: "Thanks for signing up — welcome to Shahzaib Autos!",
      react: React.createElement(NewsletterWelcome, {
        recipientEmail: subscriber.email,
      }),
    });
  } catch (err) {
    // sendEmailAsync already logs errors; swallow here
    console.error("Failed to enqueue welcome email:", err);
  }

  return subscriber;
}

export async function unsubscribeEmail(email: string) {
  return prisma.newsletterSubscriber.updateMany({
    where: { email },
    data: { subscribed: false, unsubscribedAt: new Date() },
  });
}
