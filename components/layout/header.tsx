"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e293b] bg-[#020817]/80 backdrop-blur-md">
      <div className="px-4 md:px-8 lg:px-40 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:text-[#3b82f6] transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]! text-[#3b82f6]">
            directions_car
          </span>
          <h2 className="text-white text-lg font-bold tracking-tight">
            AM Motors
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/15551234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex h-9 items-center justify-center rounded-md bg-[#25D366] px-4 text-white text-sm font-semibold shadow-sm hover:bg-[#20bd5a] transition-all focus:ring-1 focus:ring-[#25D366]"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">
              chat
            </span>
            Order on WhatsApp
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e293b] bg-[#020817]">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center justify-center rounded-md bg-[#25D366] px-4 text-white text-sm font-semibold shadow-sm hover:bg-[#20bd5a] transition-all"
            >
              <span className="material-symbols-outlined text-[18px] mr-2">
                chat
              </span>
              Order on WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
