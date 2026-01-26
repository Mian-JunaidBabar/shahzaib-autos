"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/app/actions/productActions";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    badge: "",
    badgeColor: "",
    stock: "0",
    lowStockThreshold: "10",
    isActive: true,
  });

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const price = Math.round(Number(form.price || 0) * 100);
      const stock = Number(form.stock || 0);
      const lowStockThreshold = Number(form.lowStockThreshold || 0);

      const result = await createProductAction({
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || undefined,
        price,
        category: form.category || undefined,
        badge: form.badge || undefined,
        badgeColor: form.badgeColor || undefined,
        stock,
        lowStockThreshold,
        isActive: form.isActive,
      });

      if (result.success && result.data) {
        toast.success("Product created");
        router.push(`/admin/dashboard/inventory/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create product");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-muted-foreground">
            Create a new product and set initial stock levels.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/inventory">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Create"}
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
              <Label>Price (PKR)</Label>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="1200000"
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
            <div className="space-y-2">
              <Label>Badge (optional)</Label>
              <Input
                value={form.badge}
                onChange={(e) => handleChange("badge", e.target.value)}
                placeholder="New, Hot, Featured"
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Color (optional)</Label>
              <Input
                value={form.badgeColor}
                onChange={(e) => handleChange("badgeColor", e.target.value)}
                placeholder="bg-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short description of the product"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Initial Stock</Label>
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
    </div>
  );
}
