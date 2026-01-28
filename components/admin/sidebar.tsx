"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const navItems = [
  {
    section: "Management",
    items: [
      { href: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
      {
        href: "/admin/dashboard/orders",
        icon: "shopping_cart",
        label: "Orders",
      },
      { href: "/admin/dashboard/leads", icon: "contact_phone", label: "Leads" },
      {
        href: "/admin/dashboard/bookings",
        icon: "calendar_today",
        label: "Bookings",
      },
      {
        href: "/admin/dashboard/inventory",
        icon: "inventory_2",
        label: "Inventory",
      },
      {
        href: "/admin/dashboard/services",
        icon: "build",
        label: "Services",
      },
      {
        href: "/admin/dashboard/customers",
        icon: "people",
        label: "Customers",
      },
    ],
  },
  {
    section: "Configuration",
    items: [
      { href: "/admin/dashboard/team", icon: "group", label: "Team" },
      {
        href: "/admin/dashboard/settings",
        icon: "settings",
        label: "Settings",
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="material-symbols-outlined !text-[24px] text-primary">
            directions_car
          </span>
          <h2 className="text-foreground text-lg font-bold tracking-tight">
            Shahzaib Autos
          </h2>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="px-3 mb-2 mt-4 first:mt-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.section}
            </div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-bold text-primary">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {user?.name || "Admin User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.email || "admin@shahzaibautos.com"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
