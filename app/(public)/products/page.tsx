"use client";

import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/product-card";
import { products, categories } from "@/data/products";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-border bg-section-bg pt-8 pb-8 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <nav className="flex items-center text-sm text-text-subtle mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2 text-text-subtle">/</span>
            <span className="text-text-primary font-medium">Products</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
                Car Accessories
              </h1>
              <p className="text-text-muted mt-2 max-w-2xl">
                Premium upgrades for interior comfort, exterior styling, and
                vehicle protection. Professional installation available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-40 border-b border-border bg-header-bg backdrop-blur transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Category Filters */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category.id
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border bg-card text-text-muted hover:bg-muted hover:text-text-primary"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-auto relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full md:w-64 rounded-md border border-border bg-card px-3 py-2 pl-10 text-sm placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-text-subtle mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No products found
            </h3>
            <p className="text-text-muted">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
