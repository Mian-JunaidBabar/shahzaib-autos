import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";

const mockProducts = [
  {
    id: "carbon-mirror",
    title: "Carbon Fiber Mirror Caps - M Performance Style",
    price: 299.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8Pdq850izo3R-tl4RSwHXwe8Q2nS4tQhx-vOnZBodLhx2W3rU_JVPjktGd0-ydDY-wHqEGDBgCfqB4fdlmBJ3k1r9EnwWm6eJdkyZgqsfHKT2BYWN6x-kTWFpR40YVIJZgHxDbMfZ6k6KHKKmZKcc3LjgHwI-9GMGyP_6TSUuXl_8kG_JySCWZmZYxq3kapx1-LiVa7IP71eb09HS_A1AULauN-BeZs6Y8fKjNM1mRpXB_hsK2OkR-cEfZXDIVOHT2Aap2recMwCC",
    rating: 4.5,
    reviews: 42,
    badge: "NEW" as const,
  },
  {
    id: "vossen-wheels",
    title: "Vossen HF-3 Forged Wheels - Gloss Black",
    price: 840.0,
    originalPrice: 1050.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOpZvN-sCI9QEL4AWeQJUYZlWuA0DXkdf7GJct_vptd0LCBS_K_-iWCcGPS1tbozBXF5XupQc1V2u4beoU4TYQ-bXol0ygKjtSOn7luOKca83NGMg3wzneH9Kh5Ny94U0Q40R1b5IRTKjtjCnJLyD_L9VEhuKU9yeTrHIKepOCUYR0xsFF1uYNPhVEIu3nkFeBOVW44fqkBtP029fOdGUzhmIfZ0dAxr7EiLvxgOcyayaKZMUi2ovJO9f_Obw-wNHdk3r4JaIyj3X2",
    rating: 5,
    reviews: 128,
    badge: "SALE" as const,
    badgeText: "-20%",
  },
  {
    id: "matrix-led",
    title: "Matrix Laser Headlight Assembly - Pair",
    price: 1250.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPCRotVDbUPsMvQkNAHCcFErqdaBSAPl5IxkAOmSTvSddGEC3K9eD8rK1IJR4zpbu7CIJMn84JnKUPiZEf_hU6K4H-wibL-xsu-Fy0dA7M7q00d4tyGuia05lhxwmRKEKyxV4NzAJ-B5tZJmwjDo11TLbou6I07ysNp4-49eWs2gGh8thpX2cXu4TtYDWQ_bW2Eg7pRW1I5UKHzYFRmgObcuDhC741yWrHYG9kmwlen_PaH7T-IvDmrdIHEQ2KZtdUIx0rWzZsd0MO",
    rating: 4,
    reviews: 16,
  },
  {
    id: "front-lip",
    title: "Front Lip Spoiler - Aerodynamic Package",
    price: 445.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvgYtdn0THVgbWjabZior-Z2rn02ybPNOqHDgkniEUKTeKVo8--RQeFUxuWsEySJMbtf3AsK4ULYafO91i6v9kSY9MY9PVNqccFmpWXrdXyksYMYzqGY_1sDhB9mFWmmoBKVnzx7RCQ62wiwKODGAhwMCaF5TaSQ8DxJmMyJQve3VVKKA-sEduh5EgRABRbymf3ewRQj1Y1GQ0Mfg9hDotusUk1Q-0BE6fKo0uDOTxomdbiTzmwT7UXXVT9MqGYal90UrNIuyfm3YH",
    rating: 4.5,
    reviews: 89,
    badge: "NEW" as const,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Header />

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
        <ProductFilters />

        <div className="flex-1">
          {/* Mobile Filter Toggles & Sorting */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All Products{" "}
              <span className="text-sm font-normal text-slate-500 ml-2">
                (124 results)
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
                <option>Most Relevant</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      {/* Trust Banner */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-10">
            The AM-Motors Promise
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

      <Footer />
    </div>
  );
}
