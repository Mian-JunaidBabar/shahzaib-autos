"use client";

/**
 * Edit Product Page
 *
 * Thin shell: loads the product from the server (images are included via
 * getProductAction), then delegates all form rendering and submit logic to
 * the shared <ProductForm> component which uses react-hook-form + useFieldArray.
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductAction } from "@/app/actions/productActions";
import { ProductForm } from "@/components/admin/product-form";
import type { ProductWithRelations } from "@/lib/services/product.service";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      const result = await getProductAction(params.id);

      if (!result.success || !result.data) {
        toast.error(result.error || "Product not found");
        router.push("/admin/dashboard/inventory");
        return;
      }

      setProduct(result.data as ProductWithRelations);
      setIsLoading(false);
    };

    load();
  }, [params?.id, router]);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground p-6">Loading product…</div>
    );
  }

  if (!product) return null;

  return <ProductForm initialData={product} />;
}
