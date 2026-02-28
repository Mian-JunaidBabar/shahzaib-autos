import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const { category, sort } = searchParams;

  // Build query
  const whereClause: any = {
    isActive: true,
    isArchived: false,
  };

  if (category && category !== "all") {
    // Basic category filtering logic if supported by your schema string match
    whereClause.category = { contains: category, mode: "insensitive" };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };

  // Fetch real products
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      badge: true,
    },
  });

  // Map to ProductCardProps structure
  const mappedProducts = products.map((product) => {
    // Prisma price is in cents. Converting to dollars.
    const currentPrice = (product.salePrice || product.price) / 100;
    const originalPrice = product.salePrice ? product.price / 100 : undefined;

    let badgeType: "NEW" | "SALE" | undefined = undefined;
    let badgeText = "";

    if (product.badge) {
      badgeText = product.badge.name;
      if (badgeText.toUpperCase().includes("NEW")) badgeType = "NEW";
      else if (badgeText.toUpperCase().includes("SALE")) badgeType = "SALE";
      // We can extend this logic if needed.
    } else if (product.salePrice) {
      badgeType = "SALE";
      badgeText = `-${Math.round((1 - product.salePrice / product.price) * 100)}%`;
    }

    return {
      id: product.slug, // Use slug for vanity URL routing
      title: product.name,
      price: currentPrice,
      originalPrice,
      image: product.images[0]?.secureUrl || "/placeholder-image.jpg",
      rating: 5, // Currently placeholder until review system exists
      reviews: 0,
      badge: badgeType,
      badgeText: badgeText || undefined,
    };
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Page Header */}
      <div className="bg-slate-900 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Premium Accessories
          </h1>
          <nav className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-primary font-bold">Shop All</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* We keep ProductFilters as a client container if it manages URL params */}
        <ProductFilters />

        <div className="flex-1">
          {/* Mobile Filter Toggles & Sorting */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Products{" "}
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({mappedProducts.length} results)
              </span>
            </h2>
            <div className="flex gap-4">
              <button className="lg:hidden flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-800 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>{" "}
                Filter
              </button>
              <select className="hidden md:block bg-white dark:bg-slate-800 text-sm font-medium px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm cursor-pointer focus:ring-primary focus:border-primary">
                <option value="relevant">Most Relevant</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedProducts.length > 0 ? (
              mappedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Trust Banner */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-10">
            The Shahzaib Autos Promise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary">
                  local_shipping
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                Free Shipping
              </h4>
              <p className="text-xs text-slate-500">On all orders over $500</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary">
                  verified
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                Genuine Parts
              </h4>
              <p className="text-xs text-slate-500">100% Original Guaranteed</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary">
                  support_agent
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                24/7 Support
              </h4>
              <p className="text-xs text-slate-500">Expert help anytime</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="size-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl text-primary">
                  assignment_return
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                Money-back
              </h4>
              <p className="text-xs text-slate-500">
                30-day hassle-free returns
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
