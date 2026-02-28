"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { createUnifiedOrderAction } from "@/app/actions/checkoutActions";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";
import { Service } from "@prisma/client";

export function CheckoutFlow({
  availableServices,
}: {
  availableServices: Service[];
}) {
  const { items, getTotal, clearCart } = useCart();

  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleModel: "",
    address: "",
  });

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedServices = availableServices
    .filter((s) => selectedServiceIds.includes(s.id))
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      price: s.price,
    }));

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const handleSubmit = async () => {
    setError(null);
    if (!customerData.fullName || !customerData.phone) {
      setError("Please provide at least your Full Name and Phone Number.");
      return;
    }

    if (items.length === 0 && selectedServices.length === 0) {
      setError("Your cart and booking queue are both empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createUnifiedOrderAction({
        customerData: {
          ...customerData,
          vehicleInfo: customerData.vehicleModel,
        },
        cartItems: items.map((i) => ({
          id: String(i.id), // using ID as slug mapper
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        selectedServices,
        bookingDate: bookingDate || undefined,
      });

      if (result.success && result.data?.whatsappUrl) {
        clearCart();
        window.location.href = result.data.whatsappUrl; // Redirect to WA
      } else {
        setError(result.error || "Failed to process your request.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 max-w-screen-xl mx-auto w-full">
      {/* Left Column: Forms */}
      <div className="flex-1 lg:pr-8 py-8 lg:py-12 bg-transparent">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}
        <CheckoutForm
          customerData={customerData}
          setCustomerData={setCustomerData}
          availableServices={availableServices}
          selectedServiceIds={selectedServiceIds}
          onServiceToggle={handleServiceToggle}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
        />
      </div>

      {/* Right Column: Sticky Summary */}
      <div className="w-full lg:w-[420px]">
        <OrderSummary
          cartItems={items}
          cartTotal={getTotal()}
          selectedServices={selectedServices}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
