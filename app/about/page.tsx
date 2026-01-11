import { Award, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/cta-section";

export const metadata = {
  title: "About Us - AM Motors",
  description:
    "Learn about AM Motors - your trusted partner for premium automotive accessories and professional car care services in Pakistan.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About AM Motors
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner for premium automotive accessories and
              professional car care services since our establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-4">
                AM Motors was founded with a simple mission: to provide car
                owners with access to premium quality automotive accessories and
                professional installation services at competitive prices. What
                started as a small shop has grown into a trusted name in the
                automotive accessories industry.
              </p>
              <p className="text-muted-foreground mb-4">
                We specialize in high-quality floor mats, seat covers, steering
                accessories, and a comprehensive range of interior and exterior
                car accessories. Our commitment to quality and customer
                satisfaction has made us the preferred choice for thousands of
                satisfied customers across Pakistan.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to expand our product range and services,
                always keeping our customers' needs at the forefront of
                everything we do. Whether you're looking for a simple accessory
                upgrade or a complete car interior transformation, AM Motors is
                here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Quality First</h3>
                <p className="text-sm text-muted-foreground">
                  We source only the highest quality products for our customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Customer Focus</h3>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our top priority in everything we do
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Expertise</h3>
                <p className="text-sm text-muted-foreground">
                  Professional installation and service by skilled technicians
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  Honest pricing and transparent service, always
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Premium Products</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 7D & 9D Custom-Fit Floor Mats</li>
                    <li>• High-Quality Seat Covers</li>
                    <li>• Steering Wheel Covers</li>
                    <li>• Interior & Exterior Accessories</li>
                    <li>• Car Care & Cleaning Products</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">
                    Professional Services
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Expert Installation Services</li>
                    <li>• Home Service Available</li>
                    <li>• Car Repair & Maintenance</li>
                    <li>• Interior Detailing</li>
                    <li>• Custom Fitting Solutions</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Transform Your Car?"
        description="Browse our collection of premium automotive accessories or book a service appointment today."
        primaryCTA={{ text: "Browse Products", href: "/products" }}
        secondaryCTA={{ text: "Book Service", href: "/booking" }}
        variant="muted"
      />
    </div>
  );
}
