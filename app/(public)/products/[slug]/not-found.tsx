import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="container px-4 md:px-8 lg:px-16 max-w-7xl mx-auto py-20 min-h-[60vh] flex flex-col items-center justify-center">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The product you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Button asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </section>
  );
}
