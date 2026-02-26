"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Bell, Mail, MessageCircle } from "lucide-react";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsPage() {
  const [emailSettings, setEmailSettings] = useState<NotificationSetting[]>([
    {
      id: "new-order",
      label: "New Order",
      description: "Email when a new order is placed",
      enabled: true,
    },
    {
      id: "new-booking",
      label: "New Booking",
      description: "Email when a new booking is created",
      enabled: true,
    },
    {
      id: "new-lead",
      label: "New Lead",
      description: "Email when a new lead comes in",
      enabled: true,
    },
    {
      id: "order-status",
      label: "Order Status Changes",
      description: "Email when an order status is updated",
      enabled: false,
    },
    {
      id: "low-stock",
      label: "Low Stock Alerts",
      description: "Email when a product stock is low",
      enabled: true,
    },
    {
      id: "stale-order",
      label: "Stale Order Alerts",
      description: "Email when an order becomes stale",
      enabled: true,
    },
  ]);

  const [smsSettings, setSmsSettings] = useState<NotificationSetting[]>([
    {
      id: "booking-reminder",
      label: "Booking Reminders",
      description: "SMS reminders before appointments",
      enabled: true,
    },
    {
      id: "order-confirm",
      label: "Order Confirmation",
      description: "SMS to customer on order confirmation",
      enabled: false,
    },
  ]);

  const toggleEmail = (id: string) => {
    setEmailSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const toggleSms = (id: string) => {
    setSmsSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Notifications
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure which events trigger email and SMS notifications.
        </p>
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
          {emailSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="space-y-0.5">
                <Label htmlFor={setting.id} className="text-sm font-medium">
                  {setting.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={() => toggleEmail(setting.id)}
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
            Notifications sent via SMS or WhatsApp to customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {smsSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="space-y-0.5">
                <Label htmlFor={setting.id} className="text-sm font-medium">
                  {setting.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={() => toggleSms(setting.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
