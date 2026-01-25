"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import {
  formatPrice,
  generateOrderMessage,
  openWhatsApp,
} from "@/lib/whatsapp";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  Package,
} from "lucide-react";

export default function CheckoutPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCart();

  const handleSendOrder = () => {
    const message = generateOrderMessage(items);
    openWhatsApp(message);
  };

  if (items.length === 0) {
    return (
      <section className="px-4 md:px-8 lg:px-40 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-text-subtle" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Your Cart is Empty
        </h1>
        <p className="text-text-muted mb-6 text-center max-w-md">
          Looks like you haven&apos;t added any items to your cart yet. Browse
          our products to find something you like!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:opacity-90 text-white font-semibold transition-colors"
        >
          <Package className="h-5 w-5" />
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-section-bg pt-6 pb-6 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary">
            Your Cart
          </h1>
          <p className="text-text-muted mt-2">
            {getItemCount()} {getItemCount() === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl transition-colors duration-300"
              >
                {/* Image */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary truncate">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg bg-muted hover:bg-border text-text-primary flex items-center justify-center transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-text-primary font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg bg-muted hover:bg-border text-text-primary flex items-center justify-center transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-text-muted hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Line Total (Desktop) */}
                <div className="hidden md:flex flex-col items-end justify-center">
                  <span className="text-sm text-text-muted">Subtotal</span>
                  <span className="text-lg font-bold text-text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end pt-4">
              <button
                onClick={clearCart}
                className="text-sm text-text-muted hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24 transition-colors duration-300">
              <h2 className="text-xl font-bold text-text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal ({getItemCount()} items)</span>
                  <span className="text-text-primary">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Installation</span>
                  <span className="text-green-500">FREE</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-text-primary">
                      Total
                    </span>
                    <span className="text-2xl font-black text-text-primary">
                      {formatPrice(getTotal())}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleSendOrder}
                className="w-full h-14 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30"
              >
                <MessageCircle className="h-5 w-5" />
                Send Order via WhatsApp
              </button>

              <p className="text-xs text-text-subtle text-center mt-4">
                You&apos;ll be redirected to WhatsApp to complete your order.
                Our team will confirm availability and delivery.
              </p>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Free professional installation included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <span>Secure checkout via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Installation CTA */}
      <section className="px-4 md:px-8 lg:px-40 pb-16">
        <div className="bg-linear-to-r from-primary/10 to-card border border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Need Installation?
            </h2>
            <p className="text-text-muted">
              Book a home visit from our expert technicians for hassle-free
              installation.
            </p>
          </div>
          <Link
            href="/booking"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:opacity-90 text-white font-semibold transition-colors whitespace-nowrap"
          >
            Book Installation
          </Link>
        </div>
      </section>
    </>
  );
}
