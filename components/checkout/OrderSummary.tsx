import type { ServiceDTO } from "@/lib/types/dto";
import type { CartItem } from "@/lib/whatsapp";

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  selectedServices: Array<Pick<ServiceDTO, "id" | "title" | "price">>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function OrderSummary({
  cartItems,
  cartTotal,
  selectedServices,
  onSubmit,
  isSubmitting,
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
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* Cart Items */}
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 items-center hover:bg-white/10 transition-colors"
                >
                  <div className="size-16 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img
                      alt={item.name}
                      src={item.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-white font-bold leading-tight mb-1 text-sm">
                      {item.name}
                    </p>
                    <p className="text-slate-400 text-xs mb-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-primary font-black text-sm">
                      Rs. {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Selected Services */}
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex gap-4 p-3 rounded-2xl bg-primary/10 border border-primary/20 items-center"
                >
                  <div className="size-16 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 border border-primary/30 text-primary">
                    <span className="material-symbols-outlined">build</span>
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-white font-bold leading-tight mb-1 text-sm">
                      {service.title}
                    </p>
                    <p className="text-primary/80 text-xs mb-1">
                      Service Booking
                    </p>
                    <p className="text-primary font-black text-sm">
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
