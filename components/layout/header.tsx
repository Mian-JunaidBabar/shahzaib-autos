"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useTheme } from "@/context/theme-context";
import { ShoppingCart, Sun, Moon } from "lucide-react";
import { generateWhatsAppUrl } from "@/lib/whatsapp";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const itemCount = getItemCount();
  const whatsappUrl = generateWhatsAppUrl(
    "Hi! I'm interested in your products.",
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-header-bg backdrop-blur-md transition-colors duration-300">
      <div className="px-4 md:px-8 lg:px-40 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-text-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]! text-primary">
            directions_car
          </span>
          <h2 className="text-text-primary text-lg font-bold tracking-tight">
            Shahzaib Autos
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-muted transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Cart Icon */}
          <Link
            href="/checkout"
            className="relative p-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 items-center justify-center rounded-md bg-[#25D366] px-4 text-white text-sm font-semibold shadow-sm hover:bg-[#20bd5a] transition-all focus:ring-1 focus:ring-[#25D366]"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">
              chat
            </span>
            WhatsApp
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text-primary"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/checkout"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" /> Dark Mode
                </>
              )}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center rounded-md bg-[#25D366] px-4 text-white text-sm font-semibold shadow-sm hover:bg-[#20bd5a] transition-all"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">
                chat
              </span>
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
