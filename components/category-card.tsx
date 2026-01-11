import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg group">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-bold text-xl mb-1">{category.name}</h3>
            <p className="text-sm text-white/90">
              {category.productCount} Products
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            {category.description}
          </p>
          <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
            Browse Products
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
