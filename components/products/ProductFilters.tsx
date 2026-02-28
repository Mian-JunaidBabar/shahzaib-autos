"use client";

import { useState } from "react";

export function ProductFilters() {
  const [price, setPrice] = useState(1000);

  return (
    <div className="hidden lg:block w-72 shrink-0 pe-8">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Categories
          </h3>
          <div className="space-y-3">
            {[
              "Exterior Accessories",
              "Interior Upgrades",
              "Performance Parts",
              "Audio & Multimedia",
              "Lighting Systems",
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center size-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-primary transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100 bg-primary absolute inset-0 rounded flex items-center justify-center transition-opacity">
                    check
                  </span>
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Price Range
          </h3>
          <input
            type="range"
            min="0"
            max="2000"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span>$0</span>
            <span>${price}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Top Brands
          </h3>
          <div className="space-y-3">
            {["Vossen", "Thule", "Pioneer", "Brembo"].map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center size-5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-primary transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100 bg-primary absolute inset-0 rounded flex items-center justify-center transition-opacity">
                    check
                  </span>
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
