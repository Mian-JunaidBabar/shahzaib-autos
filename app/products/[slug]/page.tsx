"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { products } from "@/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { ProductCard } from "@/components/product-card";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl border">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <Badge className="absolute top-4 right-4">{product.badge}</Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="secondary">
                  Save{" "}
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  %
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.inStock ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                In Stock
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - {formatPrice(product.price * quantity)}
            </Button>

            <Button size="lg" variant="outline" className="w-full" asChild>
              <a
                href={`https://wa.me/923001234567?text=${encodeURIComponent(
                  `Hi! I'm interested in ${product.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask About This Product
              </a>
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Free delivery on orders above PKR 5,000</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>7-day return policy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Professional installation available</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cash on delivery accepted</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
