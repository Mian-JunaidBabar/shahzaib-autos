export function OrderSummary() {
  return (
    <aside className="w-full lg:w-[420px] bg-slate-900 text-white lg:min-h-[calc(100vh-80px)] p-8 lg:p-10 sticky top-20 rounded-3xl lg:rounded-none lg:rounded-tl-[3rem] shadow-2xl overflow-y-auto">
      <div className="flex flex-col h-full space-y-10">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              shopping_bag
            </span>
            Order Summary
          </h3>

          {/* Item */}
          <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 items-center hover:bg-white/10 transition-colors">
            <div className="size-20 bg-slate-800 rounded-xl overflow-hidden shrink-0 border border-white/5">
              <img
                alt="Premium Sport Car"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnkGXrfud53o9gWpGsQ67DXDMBGEDl1Y9GCbeWGSE87im9Le3e1ukYhhTqvqK_STNO7RIUuHeZte-VLWA7yRUM53BKW6cxgBIzspRJqsS5OauHzPmtQOT0-cL6tb1Qpo4OpfuNaK430d9jaCeGzB1qZm3lQzn59MYJ26ZEynduNrj5HBdrVfjWXGDlCIXpI8MufZipOl5h0LUVk5g7BL5CvFsDMiNk1U_8PUpx-cKkvz5BZc9b6x8lfJgLgYv40KN_a0qjtwTrprbn"
              />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <p className="text-white font-bold leading-tight mb-1">
                Premium Performance Package
              </p>
              <p className="text-slate-400 text-xs mb-2">
                Engine Tune + Synthetic Oil
              </p>
              <p className="text-primary font-black">$1,250.00</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-4 border-t border-white/10 pt-8">
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Subtotal</span>
              <span className="text-white">$1,250.00</span>
            </div>
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Service Fee</span>
              <span className="text-white">$45.00</span>
            </div>
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Tax</span>
              <span className="text-white">$103.60</span>
            </div>

            <div className="flex justify-between items-end pt-6 mt-4 border-t border-white/10">
              <span className="text-lg font-bold text-slate-300">Total</span>
              <span className="text-4xl font-black text-white">$1,398.60</span>
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-auto pt-8">
          {/* CTA */}
          <button className="w-full h-16 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3">
            <span>Complete Order</span>
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </button>

          {/* Trust Badges */}
          <div className="flex flex-col items-center gap-5 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-1.5 rounded-full bg-green-500/10 text-green-500">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                SSL Secure Checkout
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-1.5 rounded-full bg-yellow-500/10 text-yellow-500">
                <span className="material-symbols-outlined text-[18px]">
                  workspace_premium
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                100% Satisfaction Guarantee
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            By placing your order, you agree to AM-Motors' Terms of Service and
            Privacy Policy. All services are performed by certified master
            technicians.
          </p>
        </div>
      </div>
    </aside>
  );
}
