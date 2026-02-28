"use client";

import Link from "next/link";
import { OptimizedImage } from "@/components/optimized-image";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

type ProductCardProps = {
  id: string; // Used as slug for URL
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: "NEW" | "SALE" | null;
  badgeText?: string;
};

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  badge,
  badgeText,
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id,
      name: title,
      price: price,
      image,
    });
    // Assuming sonner toast is installed, if not, native alert.
    try {
      toast.success("Added to cart", { description: title });
    } catch (e) {
      alert("Added to cart!");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800 flex flex-col group">
      <Link
        href={`/products/${id}`}
        className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800 block"
      >
        <OptimizedImage
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {badge === "NEW" && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-[10px] font-bold text-white rounded-lg uppercase tracking-wider backdrop-blur-md">
            New
          </span>
        )}
        {badge === "SALE" && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-[10px] font-bold text-white rounded-lg uppercase tracking-wider backdrop-blur-md">
            {badgeText || "Sale"}
          </span>
        )}

        <button className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
          <span className="material-symbols-outlined text-sm">favorite</span>
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${id}`}>
          <h3 className="text-sm font-bold line-clamp-2 mb-2 group-hover:text-primary transition-colors text-slate-900 dark:text-white">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`material-symbols-outlined text-[12px] ${star <= rating ? "fill-1" : ""}`}
              >
                {star <= rating
                  ? "star"
                  : star - 0.5 === rating
                    ? "star_half"
                    : "star"}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            ({reviews})
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-lg font-black text-primary">
              Rs. {price.toLocaleString()}
            </p>
            {originalPrice && (
              <p className="text-xs font-semibold text-slate-400 line-through">
                Rs. {originalPrice.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-slate-900 dark:text-white hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span className="material-symbols-outlined text-[18px] group-hover/btn:scale-110 transition-transform">
              add_shopping_cart
            </span>{" "}
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
