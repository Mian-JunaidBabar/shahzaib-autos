"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ProductSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync input with URL on mount
  useEffect(() => {
    const currentQuery = searchParams.get("q");
    if (currentQuery !== searchInput) {
      setSearchInput(currentQuery || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }

    // Only push if the value actually changed
    const currentQuery = searchParams.get("q");
    if (currentQuery !== (debouncedSearch || null)) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearch]);

  return (
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
        search
      </span>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search products..."
        className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all w-64"
      />
      {searchInput && (
        <button
          onClick={() => setSearchInput("")}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}
