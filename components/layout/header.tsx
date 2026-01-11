"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Booking", href: "/booking" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg font-bold text-lg">
            AM
          </div>
          <span className="font-bold text-xl">AM Motors</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* WhatsApp CTA */}
          <Button size="sm" asChild className="hidden sm:flex">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-2 border-t">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Button asChild className="w-full mt-4">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="mr-2 h-4 w-4" />
              WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
