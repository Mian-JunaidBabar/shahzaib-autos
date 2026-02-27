"use client";

import { ThemeProvider } from "@/context/theme-context";
import { CartProvider } from "@/context/cart-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { PremiumServices } from "@/components/home/PremiumServices";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
          <Header />
          <main>
            <HomeHero />
            <FeaturedInventory />
            <PremiumServices />
            <CtaBanner />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
