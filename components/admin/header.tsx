"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/theme-context";
import { useAuth } from "@/context/auth-context";

function formatLabel(segment: string) {
  const cleaned = segment.replace(/\[|\]/g, "").replace(/-/g, " ");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function AdminHeader() {
  const pathname = usePathname() || "/admin";
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Build breadcrumbs from the current path
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => ({
    href: "/" + segments.slice(0, idx + 1).join("/"),
    label: formatLabel(seg),
  }));

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/auth/login";
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-muted-foreground"
        >
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
        </nav>
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
            aria-label="Search"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <span className="material-symbols-outlined text-[22px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">
            notifications
          </span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </button>

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center">
              <span className="font-bold text-xs text-white">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-foreground">
              {user?.name || "Admin"}
            </span>
            <span className="material-symbols-outlined text-muted-foreground text-sm">
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-border">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">
                  logout
                </span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
