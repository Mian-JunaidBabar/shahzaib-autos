"use client";

/**
 * New Product Page
 *
 * Thin shell: delegates all form rendering and submit logic to
 * the shared <ProductForm> component which uses react-hook-form + useFieldArray.
 * Fetches categories dynamically.
 */

import { useEffect, useState } from "react";
import { getActiveCategoriesAction } from "@/app/actions/categoryActions";
import { ProductForm } from "@/components/admin/product-form";
import { toast } from "sonner";

export default function NewProductPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await getActiveCategoriesAction();
      if (result.success && result.data) {
        setCategories(
          result.data.map((category) => ({
            id: category.id,
            name: category.name,
          })),
        );
      } else {
        toast.error("Failed to load categories");
      }
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-6">Loading…</div>;
  }

  return <ProductForm categories={categories} />;
}
