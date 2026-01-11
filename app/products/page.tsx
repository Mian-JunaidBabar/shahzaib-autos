"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.category || null
  );

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryInfo = categories.find(
    (cat) => cat.slug === selectedCategory
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">
          {selectedCategoryInfo ? selectedCategoryInfo.name : "All Products"}
        </h1>
        <p className="text-muted-foreground">
          {selectedCategoryInfo
            ? selectedCategoryInfo.description
            : "Browse our complete collection of premium automotive accessories"}
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Products
          <Badge variant="secondary" className="ml-2">
            {products.length}
          </Badge>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.slug)}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {products.filter((p) => p.category === category.slug).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
