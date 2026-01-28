"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ProductImage = {
  id: string;
  secureUrl: string;
  publicId: string;
  sortOrder: number;
};

type Props = {
  images: ProductImage[];
  productName: string;
};

export function ImageGallery({ images, productName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fallback if no images
  if (images.length === 0) {
    return (
      <div className="aspect-square relative rounded-xl overflow-hidden bg-muted border flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative rounded-xl overflow-hidden bg-muted border">
        <Image
          src={selectedImage.secureUrl}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <Badge variant="secondary" className="absolute bottom-3 right-3">
            {selectedIndex + 1} / {images.length}
          </Badge>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                index === selectedIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/30",
              )}
            >
              <Image
                src={image.secureUrl}
                alt={`${productName} - Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
