"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeSelector } from "@/components/ui/badge-selector";
import { ProductImageManager } from "@/components/admin/product-image-manager";
import {
  getProductAction,
  updateProductAction,
} from "@/app/actions/productActions";
import { getActiveBadgesAction } from "@/app/actions/badgeActions";
import { toast } from "sonner";

interface Badge {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]); // Track image publicIds
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    price: "",
    salePrice: "",
    costPrice: "",
    barcode: "",
    category: "",
    badgeId: "",
    stock: "",
    lowStockThreshold: "",
    isActive: true,
  });

  // Calculate margin percentage
  const calculateMargin = () => {
    const price = parseFloat(form.salePrice || form.price) || 0;
    const cost = parseFloat(form.costPrice) || 0;
    if (price <= 0 || cost <= 0) return null;
    const marginValue = ((price - cost) / price) * 100;
    return marginValue.toFixed(1);
  };

  const margin = calculateMargin();

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      // Load badges
      const badgesResult = await getActiveBadgesAction();
      if (badgesResult.success && badgesResult.data) {
        setBadges(badgesResult.data as Badge[]);
      }

      // Load product
      const result = await getProductAction(params.id);
      if (!result.success || !result.data) {
        toast.error(result.error || "Product not found");
        router.push("/admin/dashboard/inventory");
        return;
      }
      const p = result.data;
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        sku: p.sku || "",
        description: p.description || "",
        price: ((p.price || 0) / 100).toString(),
        salePrice: p.salePrice ? (p.salePrice / 100).toString() : "",
        costPrice: p.costPrice ? (p.costPrice / 100).toString() : "",
        barcode: p.barcode || "",
        category: p.category || "",
        badgeId: p.badgeId || "",
        stock: (p.inventory?.quantity ?? 0).toString(),
        lowStockThreshold: (p.inventory?.lowStockAt ?? 10).toString(),
        isActive: p.isActive,
      });
      setIsLoading(false);
    };

    load();
  }, [params?.id, router]);

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => {
      // Auto-generate slug when name changes
      if (field === "name" && typeof value === "string") {
        return { ...prev, name: value, slug: normalizeSlug(value) };
      }

      // Allow manual slug editing
      if (field === "slug" && typeof value === "string") {
        return { ...prev, slug: normalizeSlug(value) };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = () => {
    if (!params?.id) return;
    setSubmitError(null); // Clear previous errors
    startTransition(async () => {
      const price = Math.round(Number(form.price || 0) * 100);
      const salePrice = form.salePrice
        ? Math.round(Number(form.salePrice || 0) * 100)
        : undefined;
      const costPrice = form.costPrice
        ? Math.round(Number(form.costPrice || 0) * 100)
        : undefined;
      const stock = Number(form.stock || 0);
      const lowStockThreshold = Number(form.lowStockThreshold || 0);

      const result = await updateProductAction({
        id: params.id,
        name: form.name,
        slug: form.slug || undefined,
        sku: form.sku,
        description: form.description || undefined,
        price,
        salePrice,
        costPrice,
        barcode: form.barcode || undefined,
        category: form.category || undefined,
        badgeId: form.badgeId || undefined,
        stock,
        lowStockThreshold,
        isActive: form.isActive,
        keepImagePublicIds: currentImages, // Pass the current image list
      });

      if (result.success) {
        toast.success("Product updated");
        router.push(`/admin/dashboard/inventory/${params.id}`);
      } else {
        // Parse validation errors if they exist
        let errorMessage = result.error || "Failed to update product";
        try {
          const parsed = JSON.parse(errorMessage);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Extract the first validation error message
            errorMessage = parsed[0].message || errorMessage;
          }
        } catch {
          // Not JSON, use as-is
        }
        setSubmitError(errorMessage);
      }
    });
  };

  const handleImagesChange = useCallback((images: { publicId: string }[]) => {
    setCurrentImages(images.map((img) => img.publicId));
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading product...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product details and stock.
          </p>
          {submitError && (
            <p className="text-sm text-destructive mt-2">{submitError}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/dashboard/inventory/${params?.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Toyota Corolla"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (optional)</Label>
              <Input
                value={form.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="toyota-corolla"
              />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) =>
                  handleChange("sku", e.target.value.toUpperCase())
                }
                placeholder="ABC-1234"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="SUV, Sedan, etc"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Selling Price (PKR)</Label>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sale Price (optional)</Label>
              <Input
                type="number"
                min="0"
                value={form.salePrice}
                onChange={(e) => handleChange("salePrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Cost Price (internal)
                {margin && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Margin: {margin}%
                  </span>
                )}
              </Label>
              <Input
                type="number"
                min="0"
                value={form.costPrice}
                onChange={(e) => handleChange("costPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Tabs defaultValue="edit">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Short description of the product"
                  rows={4}
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-30 rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                  {form.description || "No description"}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {badges.length > 0 && (
            <BadgeSelector
              badges={badges}
              value={form.badgeId}
              onChange={(badgeId) => handleChange("badgeId", badgeId || "")}
              label="Badge (optional)"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Low Stock Threshold</Label>
            <Input
              type="number"
              min="0"
              value={form.lowStockThreshold}
              onChange={(e) =>
                handleChange("lowStockThreshold", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Barcode (optional)</Label>
            <Input
              value={form.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              placeholder="Scan or type barcode"
            />
          </div>
          <div className="space-y-2 flex items-center justify-between border rounded-md px-3 py-2">
            <div>
              <Label className="block">Active</Label>
              <p className="text-sm text-muted-foreground">
                Product visible in storefront
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={form.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      {params?.id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductImageManager
              productId={params.id}
              maxFiles={10}
              onImagesChange={handleImagesChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
