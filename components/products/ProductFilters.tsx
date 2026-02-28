"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

type Badge = { id: string; name: string; usageCount?: number };

export function ProductFilters() {
  const [categories, setCategories] = useState<string[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [topTags, setTopTags] = useState<Badge[]>([]);
  const [topCategories, setTopCategories] = useState<string[]>([]);

  // Local state for inputs (before debouncing)
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");

  // Debounced values for URL updates
  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch initial data
  useEffect(() => {
    // Fetch categories
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));

    // Fetch all badges/tags
    fetch("/api/admin/badges")
      .then((r) => r.json())
      .then((data) => setBadges(Array.isArray(data) ? data : []))
      .catch(() => setBadges([]));

    // Fetch top 3 tags
    fetch("/api/admin/top-tags")
      .then((r) => r.json())
      .then((data) => setTopTags(Array.isArray(data) ? data : []))
      .catch(() => setTopTags([]));

    // Fetch top selling categories
    fetch("/api/admin/top-categories")
      .then((r) => r.json())
      .then((data) => setTopCategories(Array.isArray(data) ? data : []))
      .catch(() => setTopCategories([]));
  }, []);

  // Sync local state with URL params
  useEffect(() => {
    const categoryParam = searchParams.get("categories");
    const tagsParam = searchParams.get("tags");
    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    setSelectedCategories(
      categoryParam
        ? categoryParam
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
    );

    setSelectedTags(
      tagsParam
        ? tagsParam
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    );

    setMinPriceInput(minParam || "");
    setMaxPriceInput(maxParam || "");
  }, [searchParams]);

  // Update URL when debounced price values change
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (debouncedMinPrice) {
      params.set("min", debouncedMinPrice);
    } else {
      params.delete("min");
    }

    if (debouncedMaxPrice) {
      params.set("max", debouncedMaxPrice);
    } else {
      params.delete("max");
    }

    // Only push if values actually changed
    const currentMin = searchParams.get("min");
    const currentMax = searchParams.get("max");

    if (
      currentMin !== (debouncedMinPrice || null) ||
      currentMax !== (debouncedMaxPrice || null)
    ) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const updateArrayParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (values.length) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    updateArrayParam("categories", next);
  };

  const toggleTag = (tagId: string) => {
    const next = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(next);
    updateArrayParam("tags", next);
  };

  // Get regular tags (excluding top 3)
  const regularTags = badges.filter(
    (badge) => !topTags.some((topTag) => topTag.id === badge.id),
  );

  return (
    <div className="hidden lg:block w-72 shrink-0 pe-8">
      <div className="sticky top-28 space-y-8">
        {/* All Categories */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            All Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedCategories.includes(cat)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50"
                  }`}
                >
                  {cat}
                </button>
              ))
            ) : (
              <div className="text-sm text-slate-500">No categories</div>
            )}
          </div>
        </div>

        {/* Top Selling Categories */}
        {topCategories.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
              🔥 Top Categories
            </h3>
            <div className="space-y-2">
              {topCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer ${
                    selectedCategories.includes(cat)
                      ? "bg-primary/10 text-primary dark:text-primary font-semibold border border-primary/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range (Debounced) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Price Range
          </h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Filters auto-apply as you type
          </p>
        </div>

        {/* Top 3 Tags */}
        {topTags.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
              ⭐ Top 3 Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-md ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-linear-to-r from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border-yellow-300 dark:border-yellow-700 text-slate-700 dark:text-slate-300 hover:border-primary/50"
                  }`}
                >
                  <span className="font-semibold">{tag.name}</span>
                  <span className="text-xs opacity-80 bg-white/30 dark:bg-black/30 px-1.5 py-0.5 rounded">
                    {tag.usageCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Tags */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            All Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {regularTags.length > 0 ? (
              regularTags.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => toggleTag(badge.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-md ${
                    selectedTags.includes(badge.id)
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50"
                  }`}
                >
                  <span>{badge.name}</span>
                  {badge.usageCount !== undefined && (
                    <span className="text-xs opacity-70">
                      {badge.usageCount}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="text-sm text-slate-500">No tags available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
