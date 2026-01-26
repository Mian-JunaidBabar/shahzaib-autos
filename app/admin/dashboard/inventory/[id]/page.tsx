import {
  ArrowLeft,
  Edit,
  Package,
  Tag,
  DollarSign,
  CircleCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductAction } from "@/app/actions/productActions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";

function formatPrice(price: number) {
  return `PKR ${(price / 100).toLocaleString()}`;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductAction(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  const product = result.data;
  const stock = product.inventory?.quantity ?? 0;
  const lowStockAt = product.inventory?.lowStockAt ?? 0;

  const stockBadge = (() => {
    if (!product.inventory || stock === 0) {
      return {
        label: "Out of Stock",
        variant: "destructive" as const,
        icon: XCircle,
      };
    }
    if (stock <= lowStockAt) {
      return {
        label: "Low Stock",
        variant: "secondary" as const,
        icon: AlertTriangle,
      };
    }
    return {
      label: "In Stock",
      variant: "default" as const,
      icon: CircleCheck,
    };
  })();

  const StockIcon = stockBadge.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Details</h1>
          <p className="text-muted-foreground">View product info and status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/dashboard/inventory">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/admin/dashboard/inventory/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant={stockBadge.variant}
                className="flex items-center gap-1"
              >
                <StockIcon className="h-3 w-3" />
                {stockBadge.label}
              </Badge>
              {product.badge && (
                <Badge className={product.badgeColor || ""}>
                  {product.badge}
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {product.name}
            </CardTitle>
            <p className="text-muted-foreground">Slug: {product.slug}</p>
          </div>
          <div className="text-right space-y-2 min-w-45">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted-foreground">
              Category: {product.category || "-"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {product.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 leading-relaxed">{product.description}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" /> Price
              </div>
              <p className="text-xl font-semibold">
                {formatPrice(product.price)}
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" /> Category
              </div>
              <p className="text-xl font-semibold">{product.category || "—"}</p>
            </div>
            <div className="border rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" /> Stock
              </div>
              <p className="text-xl font-semibold">
                {product.inventory ? `${stock} units` : "No inventory record"}
              </p>
              {product.inventory && (
                <p className="text-sm text-muted-foreground">
                  Low stock at {product.inventory.lowStockAt}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>Created: {formatDate(product.createdAt)}</p>
            <p>Updated: {formatDate(product.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      {product.images && product.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.images.map((img) => (
              <div key={img.id} className="border rounded-lg overflow-hidden">
                <div
                  className="aspect-video bg-muted"
                  style={{
                    backgroundImage: `url(${img.secureUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="truncate">{img.secureUrl}</span>
                  {img.isPrimary && <Badge variant="outline">Primary</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
