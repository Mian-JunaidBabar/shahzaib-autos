import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
