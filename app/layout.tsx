import "./globals.css";

import { FloatingWhatsAppButton } from "@/components/whatsapp-button";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AM Motors - Premium Automotive Accessories",
  description:
    "Your trusted partner for premium automotive accessories and professional car care services in Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
