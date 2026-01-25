"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    section: "Management",
    items: [
      { href: "/admin", icon: "dashboard", label: "Dashboard" },
      { href: "/admin/orders", icon: "shopping_cart", label: "Orders" },
      { href: "/admin/leads", icon: "contact_phone", label: "Leads" },
      { href: "/admin/bookings", icon: "calendar_today", label: "Bookings" },
      { href: "/admin/inventory", icon: "inventory_2", label: "Inventory" },
      { href: "/admin/customers", icon: "people", label: "Customers" },
    ],
  },
  {
    section: "Configuration",
    items: [
      { href: "/admin/team", icon: "group", label: "Team" },
      { href: "/admin/settings", icon: "settings", label: "Settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <span className="material-symbols-outlined !text-[24px] text-primary">
            directions_car
          </span>
          <h2 className="text-white text-lg font-bold tracking-tight">
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
                    : "text-slate-400 hover:text-white hover:bg-muted"
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
          <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-slate-400">
              person
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Admin User</span>
            <span className="text-xs text-slate-500">
              admin@shahzaibautos.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
