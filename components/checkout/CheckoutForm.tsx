export function CheckoutForm() {
  return (
    <div className="flex-1 p-4 lg:p-8 space-y-10 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      {/* Express Checkout */}
      <section>
        <h3 className="text-slate-900 dark:text-white text-xl font-black mb-6">
          Express Checkout
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl h-14 bg-black text-white font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            <span className="material-symbols-outlined text-[20px]">ios</span>
            <span>Pay</span>
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl h-14 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              google
            </span>
            <span>Pay</span>
          </button>
        </div>

        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            or continue with email
          </span>
          <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-6">
        <h3 className="text-slate-900 dark:text-white text-xl font-black">
          Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
              Email Address
            </label>
            <input
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="alex@am-motors.com"
              type="email"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
              Phone Number
            </label>
            <input
              className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="+1 (555) 000-0000"
              type="tel"
            />
          </div>
        </div>
      </section>

      {/* Service & Details */}
      <section className="space-y-6">
        <h3 className="text-slate-900 dark:text-white text-xl font-black">
          Service & Vehicle Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
              Vehicle Model
            </label>
            <select className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none shadow-sm cursor-pointer text-slate-900 dark:text-white">
              <option>Porsche 911 GT3 (992)</option>
              <option>BMW M4 Competition</option>
              <option>Audi RS6 Avant</option>
              <option>Other / Not Listed</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
              Booking Date
            </label>
            <div className="relative font-sans">
              <input
                className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white"
                type="date"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
            Service Address / Location (If applicable)
          </label>
          <input
            className="w-full h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white"
            placeholder="123 Performance Way, Los Angeles, CA"
            type="text"
          />
        </div>
      </section>

      {/* Payment Method */}
      <section className="space-y-6">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-slate-900 dark:text-white text-xl font-black">
            Payment Method
          </h3>
          <div className="flex gap-2">
            <div className="w-10 h-6 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] font-black text-primary uppercase tracking-wider">
              VISA
            </div>
            <div className="w-10 h-6 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] font-black text-rose-500 uppercase tracking-wider">
              MC
            </div>
            <div className="w-10 h-6 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] font-black text-blue-400 uppercase tracking-wider">
              AMEX
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-4 shadow-sm">
          <div className="relative">
            <input
              className="w-full h-14 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white transition-shadow"
              placeholder="Card number"
              type="text"
            />
            <span className="material-symbols-outlined absolute right-4 top-4 text-slate-400">
              credit_card
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full h-14 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white transition-shadow"
              placeholder="MM / YY"
              type="text"
            />
            <input
              className="w-full h-14 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm text-slate-900 dark:text-white transition-shadow"
              placeholder="CVC"
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-4">
          <input
            className="size-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-white dark:bg-slate-800 cursor-pointer"
            id="save-card"
            type="checkbox"
          />
          <label
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
            htmlFor="save-card"
          >
            Securely save this card for future bookings
          </label>
        </div>
      </section>
    </div>
  );
}
