"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  categories: string[];
  priceRange: { min: number; max: number };
};

export function ProductFilters({ categories, priceRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const hasActiveFilters =
    currentCategory || currentMinPrice || currentMaxPrice;

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`/products?${params.toString()}`);
    setOpen(false);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
    setOpen(false);
  };

  const formatPrice = (cents: number) =>
    `Rs. ${(cents / 100).toLocaleString("en-PK")}`;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">Category</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!currentCategory ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ category: null })}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={currentCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ category: cat })}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Min</label>
            <select
              className="w-full mt-1 p-2 border rounded-md bg-background"
              value={currentMinPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            >
              <option value="">Any</option>
              <option value="0">{formatPrice(0)}</option>
              <option value="100000">{formatPrice(100000)}</option>
              <option value="500000">{formatPrice(500000)}</option>
              <option value="1000000">{formatPrice(1000000)}</option>
              <option value="2500000">{formatPrice(2500000)}</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Max</label>
            <select
              className="w-full mt-1 p-2 border rounded-md bg-background"
              value={currentMaxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            >
              <option value="">Any</option>
              <option value="500000">{formatPrice(500000)}</option>
              <option value="1000000">{formatPrice(1000000)}</option>
              <option value="2500000">{formatPrice(2500000)}</option>
              <option value="5000000">{formatPrice(5000000)}</option>
              <option value="10000000">{formatPrice(10000000)}</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Range: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
        </p>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button variant="ghost" className="w-full" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-4 bg-card rounded-lg border p-4">
          <h3 className="font-semibold text-lg mb-4">Filters</h3>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

// Active Filter Tags Component
export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const query = searchParams.get("query");

  const hasFilters = category || minPrice || maxPrice || query;

  if (!hasFilters) return null;

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const formatPrice = (cents: string) =>
    `Rs. ${(parseInt(cents) / 100).toLocaleString("en-PK")}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {query && (
        <Badge variant="secondary" className="gap-1">
          Search: {query}
          <button onClick={() => removeFilter("query")}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {category && (
        <Badge variant="secondary" className="gap-1">
          {category}
          <button onClick={() => removeFilter("category")}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {minPrice && (
        <Badge variant="secondary" className="gap-1">
          Min: {formatPrice(minPrice)}
          <button onClick={() => removeFilter("minPrice")}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {maxPrice && (
        <Badge variant="secondary" className="gap-1">
          Max: {formatPrice(maxPrice)}
          <button onClick={() => removeFilter("maxPrice")}>
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
