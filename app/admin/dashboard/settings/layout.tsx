"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: "profile",
    title: "Admin Profile",
    description: "Manage your profile, avatar, and password",
    icon: "person",
    href: "/admin/dashboard/settings/profile",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email, SMS, and push notification preferences",
    icon: "notifications",
    href: "/admin/dashboard/settings/notifications",
  },
  {
    id: "payments",
    title: "Payment Settings",
    description: "Payment gateways, currencies, and transaction settings",
    icon: "payment",
    href: "/admin/dashboard/settings/payments",
  },
  {
    id: "booking",
    title: "Booking Configuration",
    description: "Appointment slots, booking rules, and availability settings",
    icon: "event_available",
    href: "/admin/dashboard/settings/booking",
  },
  {
    id: "badges",
    title: "Product Badges",
    description: "Create and manage product badges and colors",
    icon: "label",
    href: "/admin/dashboard/settings/badges",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your business settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const isActive = pathname === section.href;

                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`block w-full text-left p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm">
                        {section.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{section.title}</p>
                        <p className="text-xs opacity-75 truncate">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border border-border p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
