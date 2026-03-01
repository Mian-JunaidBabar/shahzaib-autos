"use client";

import type { ServiceDTO } from "@/lib/types/dto";
import type { CartItem } from "@/lib/whatsapp";

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  selectedServices: Array<Pick<ServiceDTO, "id" | "title" | "price">>;
  onSubmit: () => void;
  isSubmitting: boolean;
  pageError?: string;
}

export function OrderSummary({
  cartItems,
  cartTotal,
  selectedServices,
  onSubmit,
  isSubmitting,
  pageError,
}: OrderSummaryProps) {
  const servicesTotal = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const total = cartTotal + servicesTotal;

  return (
    <aside className="w-full bg-slate-900 text-white lg:min-h-[calc(100vh-80px)] p-8 lg:p-10 sticky top-0 rounded-3xl lg:rounded-none lg:rounded-tl-[3rem] shadow-2xl overflow-y-auto z-10">
      <div className="flex flex-col h-full space-y-10">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              shopping_bag
            </span>
            Order Summary
          </h3>

          {cartItems.length === 0 && selectedServices.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-white/10 rounded-2xl border-dashed">
              Your cart and booking queue are empty.
            </div>
          ) : (
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Cart Items */}
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">
                      {item.name}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-base">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Selected Services */}
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm mb-1">
                      {service.title}
                    </p>
                    <p className="text-primary/80 text-xs">Service Booking</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-base">
                      Rs. {service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="space-y-4 border-t border-white/10 pt-8 mt-6">
            {cartItems.length > 0 && (
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Products Subtotal</span>
                <span className="text-white">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            )}
            {selectedServices.length > 0 && (
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Services Total</span>
                <span className="text-white">
                  Rs. {servicesTotal.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between items-end pt-6 mt-4 border-t border-white/10">
              <span className="text-lg font-bold text-slate-300">Total</span>
              <span className="text-4xl font-black text-white">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-auto pt-8">
          {/** Page-level error shown above CTA so user notices it near the action button */}
          {/** This mirrors the left-column form error but places it close to the CTA */}
          {/** pageError can be validation or submission error messages */}
          {pageError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {pageError}
            </div>
          )}
          {/* CTA */}
          <button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              (cartItems.length === 0 && selectedServices.length === 0)
            }
            className="w-full h-16 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-lg shadow-xl shadow-[#25D366]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin text-[24px]">
                progress_activity
              </span>
            ) : (
              <>
                <span>Checkout via WhatsApp</span>
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            By placing your order, you agree to Shahzaib Autos terms. All
            services are performed by certified master technicians.
          </p>
        </div>
      </div>
    </aside>
  );
}
