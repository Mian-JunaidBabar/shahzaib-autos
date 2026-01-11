import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  variant?: "default" | "muted";
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = "default",
}: CTASectionProps) {
  return (
    <section
      className={`py-16 ${
        variant === "muted" ? "bg-muted/50" : "bg-primary/5"
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <Button size="lg" asChild>
              <Link href={primaryCTA.href}>
                {primaryCTA.text}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {secondaryCTA && (
            <Button size="lg" variant="outline" asChild>
              <Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
