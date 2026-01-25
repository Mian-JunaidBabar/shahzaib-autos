"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/bookings": "Bookings",
  "/admin/inventory": "Inventory",
  "/admin/leads": "Leads",
  "/admin/customers": "Customers",
  "/admin/team": "Team",
  "/admin/settings": "Settings",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label =
        breadcrumbMap[currentPath] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-sm font-semibold text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm font-medium hover:text-foreground cursor-pointer"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-muted-foreground">
            search
          </span>
          <input
            className="h-9 w-64 rounded-md border border-border bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </button>

        {/* User avatar */}
        <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-[1px]">
          <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
            <span className="font-bold text-xs text-primary">SA</span>
          </div>
        </button>
      </div>
    </header>
  );
}
