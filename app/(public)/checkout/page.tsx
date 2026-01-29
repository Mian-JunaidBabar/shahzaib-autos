"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/whatsapp";
import { createPublicOrderAction } from "@/app/actions/orderActions";
import {
  checkoutCustomerSchema,
  type CheckoutCustomer,
} from "@/lib/validations";
import { toast } from "sonner";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CheckoutPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    whatsappUrl: string;
  } | null>(null);

  // Form setup with Zod validation
  const form = useForm<CheckoutCustomer>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (customerData: CheckoutCustomer) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPublicOrderAction({
        customer: customerData,
        items: items.map((item) => ({
          id: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      });

      if (result.success && result.data) {
        // Clear the cart after successful order
        clearCart();

        // Store success data for display
        setOrderSuccess({
          orderNumber: result.data.orderNumber,
          whatsappUrl: result.data.whatsappUrl,
        });

        toast.success(`Order ${result.data.orderNumber} created successfully!`);

        // Redirect to WhatsApp
        window.location.href = result.data.whatsappUrl;
      } else {
        toast.error(result.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state after order
  if (orderSuccess) {
    return (
      <section className="px-4 md:px-8 lg:px-40 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-text-muted mb-2 text-center max-w-md">
          Your order{" "}
          <span className="font-semibold">{orderSuccess.orderNumber}</span> has
          been placed.
        </p>
        <p className="text-text-muted mb-6 text-center max-w-md">
          Redirecting you to WhatsApp to confirm with our team...
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={orderSuccess.whatsappUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Open WhatsApp
          </a>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:opacity-90 text-white font-semibold transition-colors"
          >
            <Package className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  // Empty cart state
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
            Checkout
          </h1>
          <p className="text-text-muted mt-2">
            {getItemCount()} {getItemCount() === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Customer Details + Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details Form */}
            <div className="bg-card border border-border rounded-xl p-6 transition-colors duration-300">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Customer Details
              </h2>

              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 03001234567"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your complete delivery address"
                            rows={3}
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Order Items
              </h2>

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
                          disabled={isSubmitting}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-border text-text-primary flex items-center justify-center transition-colors disabled:opacity-50"
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
                          disabled={isSubmitting}
                          className="w-8 h-8 rounded-lg bg-muted hover:bg-border text-text-primary flex items-center justify-center transition-colors disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isSubmitting}
                        className="p-2 text-text-muted hover:text-red-500 transition-colors disabled:opacity-50"
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
                  disabled={isSubmitting}
                  className="text-sm text-text-muted hover:text-red-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
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
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full h-14 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5" />
                    Send Order via WhatsApp
                  </>
                )}
              </button>

              <p className="text-xs text-text-subtle text-center mt-4">
                Your order will be saved and you&apos;ll be redirected to
                WhatsApp to confirm with our team.
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
