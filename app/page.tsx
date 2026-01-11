import { ArrowRight, Wrench, Home, Shield, Truck } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { CTASection } from "@/components/cta-section";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data";
import Link from "next/link";

export const metadata = {
  title: "AM Motors - Premium Automotive Accessories & Services",
  description:
    "Your trusted partner for premium automotive accessories including floor mats, seat covers, and professional car care services in Pakistan.",
};

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const topCategories = categories.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Automotive Accessories & Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Transform your vehicle with our high-quality floor mats, seat
              covers, and professional installation services. Quality you can
              trust, service you can rely on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/booking">Book a Service</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                100% authentic products with quality guarantee
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Nationwide delivery within 2-7 business days
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Installation</h3>
              <p className="text-sm text-muted-foreground">
                Professional installation at shop or your home
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Home Service</h3>
              <p className="text-sm text-muted-foreground">
                Convenient home installation service available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Our most popular automotive accessories
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of automotive accessories and find exactly
              what you need for your vehicle
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Services CTA */}
      <CTASection
        title="Need Professional Installation?"
        description="Our expert technicians provide professional installation services at our shop or at your doorstep. Book your appointment today!"
        primaryCTA={{ text: "Book Service Now", href: "/booking" }}
        secondaryCTA={{ text: "Learn More", href: "/about" }}
        variant="muted"
      />

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have Questions? We're Here to Help!
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Contact us via WhatsApp for instant support, product inquiries, or
              custom orders
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
