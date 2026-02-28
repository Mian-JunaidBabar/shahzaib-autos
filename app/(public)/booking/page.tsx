
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">

      {/* Minimal Header */}
      <div className="bg-slate-900 py-12 px-4 shadow-inner">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
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

      <main className="flex flex-col lg:flex-row flex-1 max-w-screen-xl mx-auto w-full">
        {/* Left Column: Forms */}
        <div className="flex-1 lg:pr-8 py-8 lg:py-12 bg-transparent">
          <CheckoutForm />
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="w-full lg:w-[420px]">
          <OrderSummary />
        </div>
      </main>

    </div>
  );
}
