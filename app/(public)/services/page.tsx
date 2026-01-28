import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getActiveServices } from "@/lib/services/service.service";
import { Wrench, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Mark this page as dynamic to prevent static generation during build
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services | Shahzaib Autos",
  description:
    "Professional auto services including ceramic coating, detailing, mat installation, and more. Book your appointment today.",
};

/**
 * Format price for display
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Convert minutes to human-readable format
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional auto care services tailored to your needs. From ceramic
            coating to complete detailing, we provide top-quality service with
            attention to detail.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Services Available
            </h2>
            <p className="text-muted-foreground">
              We&apos;re currently updating our services. Please check back
              soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wrench className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {service.description ||
                      "Professional service with quality guarantee."}
                  </p>

                  {/* Price & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(service.price)}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Link
                    href={`/booking?service=${service.slug}`}
                    className="w-full"
                  >
                    <Button className="w-full group/btn">
                      Book Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Service?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Contact us to discuss
            your specific requirements. We&apos;re happy to provide custom
            solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg">
                Book an Appointment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
