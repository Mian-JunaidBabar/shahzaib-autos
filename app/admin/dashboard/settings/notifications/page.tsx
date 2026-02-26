"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    newOrderEmail: true,
    newBookingEmail: true,
    newLeadEmail: true,
    orderStatusEmail: false,
    lowStockEmail: true,
    staleOrderEmail: true,
    bookingReminderSms: true,
    orderConfirmSms: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings/notifications");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          newOrderEmail: data.newOrderEmail ?? true,
          newBookingEmail: data.newBookingEmail ?? true,
          newLeadEmail: data.newLeadEmail ?? true,
          orderStatusEmail: data.orderStatusEmail ?? false,
          lowStockEmail: data.lowStockEmail ?? true,
          staleOrderEmail: data.staleOrderEmail ?? true,
          bookingReminderSms: data.bookingReminderSms ?? true,
          orderConfirmSms: data.orderConfirmSms ?? false,
        });
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
      toast.error("Failed to load notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Notification preferences saved successfully");
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Failed to save", error);
      toast.error("Error saving preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const emailItems = [
    {
      id: "newOrderEmail",
      label: "New Order",
      desc: "Email when a new order is placed",
    },
    {
      id: "newBookingEmail",
      label: "New Booking",
      desc: "Email when a new booking is created",
    },
    {
      id: "newLeadEmail",
      label: "New Lead",
      desc: "Email when a new lead comes in",
    },
    {
      id: "orderStatusEmail",
      label: "Order Status Changes",
      desc: "Email when an order status is updated",
    },
    {
      id: "lowStockEmail",
      label: "Low Stock Alerts",
      desc: "Email when a product stock is low",
    },
    {
      id: "staleOrderEmail",
      label: "Stale Order Alerts",
      desc: "Email when an order becomes stale",
    },
  ] as const;

  const smsItems = [
    {
      id: "bookingReminderSms",
      label: "Booking Reminders",
      desc: "SMS reminders before appointments",
    },
    {
      id: "orderConfirmSms",
      label: "Order Confirmation",
      desc: "SMS to customer on order confirmation",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Notifications
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure which events trigger email and SMS notifications.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Email Notifications</CardTitle>
          </div>
          <CardDescription>
            Notifications sent to the admin email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="text-sm font-medium">
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                id={item.id}
                checked={settings[item.id as keyof typeof settings]}
                onCheckedChange={() =>
                  handleToggle(item.id as keyof typeof settings)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">
              SMS / WhatsApp Notifications
            </CardTitle>
          </div>
          <CardDescription>
            Automated notifications sent via SMS or WhatsApp to customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {smsItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="text-sm font-medium">
                  {item.label}
                </Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                id={item.id}
                checked={settings[item.id as keyof typeof settings]}
                onCheckedChange={() =>
                  handleToggle(item.id as keyof typeof settings)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
