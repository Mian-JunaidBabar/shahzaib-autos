"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";
import { useCart } from "@/context/cart-context";
import { getProductBySlug } from "@/data/products";
import { formatPrice, generateWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingCart,
  Check,
  MessageCircle,
  Calendar,
  Truck,
  Shield,
  Headphones,
  ChevronLeft,
} from "lucide-react";

// Extended product details
const productExtras: Record<
  string,
  { features: string[]; specs: { label: string; value: string }[] }
> = {
  "7d-custom-mats": {
    features: [
      "Premium quality leather finish",
      "Custom-cut for your exact car model",
      "Multi-layer waterproof protection",
      "Anti-slip bottom layer",
    ],
    specs: [
      { label: "Material", value: "Premium PU Leather + XPE" },
      { label: "Layers", value: "7-layer construction" },
      { label: "Waterproof", value: "Yes, full coverage" },
      { label: "Warranty", value: "1 Year" },
    ],
  },
  "led-projector-kit": {
    features: [
      "50,000+ hour lifespan",
      "6000K pure white output",
      "Built-in CAN bus decoder",
      "Plug and play installation",
    ],
    specs: [
      { label: "Lumens", value: "12,000 per pair" },
      { label: "Color Temp", value: "6000K Pure White" },
      { label: "Wattage", value: "55W per bulb" },
      { label: "Warranty", value: "2 Years" },
    ],
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const extras = productExtras[slug] || {
    features: ["Professional installation available", "Quality guaranteed"],
    specs: [{ label: "Warranty", value: "1 Year" }],
  };

  const isInCart = product
    ? items.some((item) => item.id === product.id)
    : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (!product) {
    return (
      <section className="px-4 md:px-8 lg:px-40 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCart className="h-16 w-16 text-slate-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Product Not Found
        </h1>
        <p className="text-slate-400 mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/products"
          className="px-6 py-2 rounded-md bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium transition-colors"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  const whatsappMessage = `Hi! I'm interested in: ${product.name} (${formatPrice(product.price)})`;
  const whatsappUrl = generateWhatsAppUrl(whatsappMessage);

  return (
    <>
      {/* Breadcrumb */}
      <section className="border-b border-[#1e293b] bg-[#0f172a]/30 pt-6 pb-6">
        <div className="px-4 md:px-8 lg:px-40">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <nav className="flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-[#3b82f6] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <Link
              href="/products"
              className="hover:text-[#3b82f6] transition-colors"
            >
              Products
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-4/3 relative rounded-xl overflow-hidden bg-[#0f172a] border border-[#1e293b]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <div
                className={`absolute top-4 right-4 ${product.badgeColor || "bg-[#3b82f6]"} text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg`}
              >
                {product.badge}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#3b82f6] font-medium uppercase tracking-wide mb-2">
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                {product.name}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline gap-3 pb-6 border-b border-[#1e293b]">
              <span className="text-4xl font-black text-white">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-[#3b82f6]" />
                Key Features
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extras.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-slate-300"
                  >
                    <Check className="h-4 w-4 text-[#25D366] mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={justAdded}
                className={`flex-1 h-14 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all shadow-lg ${
                  justAdded
                    ? "bg-green-600 text-white"
                    : "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {isInCart ? "Add Another" : "Add to Cart"}
                  </>
                )}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                Ask on WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Truck className="h-4 w-4" />
                Free Installation
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="h-4 w-4" />
                Warranty Included
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Headphones className="h-4 w-4" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="px-4 md:px-8 lg:px-40 pb-16">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Specifications</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {extras.specs.map((spec, index) => (
              <div
                key={index}
                className="flex flex-col p-4 bg-[#020817] rounded-lg border border-[#1e293b]"
              >
                <span className="text-sm text-slate-500 mb-1">
                  {spec.label}
                </span>
                <span className="text-white font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Installation CTA */}
      <section className="px-4 md:px-8 lg:px-40 pb-16">
        <div className="bg-linear-to-r from-[#3b82f6]/10 to-[#0f172a] border border-[#1e293b] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Need Professional Installation?
            </h2>
            <p className="text-slate-400">
              Book a home installation appointment with our expert technicians.
            </p>
          </div>
          <Link
            href="/booking"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-[#020817] font-semibold transition-colors whitespace-nowrap"
          >
            <Calendar className="h-5 w-5" />
            Book Installation
          </Link>
        </div>
      </section>
    </>
  );
}
