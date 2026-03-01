"use client";

import { useState } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import type { CartItem } from "@/lib/whatsapp";
import type { ServiceDTO } from "@/lib/types/dto";

interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  vehicleModel: string;
  address: string;
}

export default function BookingPage() {
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    fullName: "",
    email: "",
    phone: "",
    vehicleModel: "",
    address: "",
  });
  const [availableServices] = useState<ServiceDTO[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [cartItems] = useState<CartItem[]>([]);
  const [cartTotal] = useState<number>(0);
  const [selectedServices] = useState<ServiceDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onServiceToggle = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // noop: actual submit handled elsewhere
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Minimal Header */}
      <div className="bg-slate-900 py-12 px-4 shadow-inner">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">Book Your Service</h1>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[18px]">
              verified_user
            </span>
            <span className="text-sm font-bold uppercase tracking-widest">
              Guaranteed
            </span>
          </div>
        </div>
      </div>

      <main className="flex flex-col lg:flex-row flex-1 max-w-xl mx-auto w-full">
        {/* Left Column: Forms */}
        <div className="flex-1 lg:pr-8 py-8 lg:py-12 bg-transparent">
          <CheckoutForm
            customerData={customerData}
            setCustomerData={setCustomerData}
            availableServices={availableServices}
            selectedServiceIds={selectedServiceIds}
            onServiceToggle={onServiceToggle}
            bookingDate={bookingDate}
            setBookingDate={setBookingDate}
          />
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="w-full lg:w-105">
          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            selectedServices={selectedServices}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
}
