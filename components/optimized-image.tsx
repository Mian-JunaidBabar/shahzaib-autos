"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component for handling remote image optimization with timeouts
 * Prevents ETIMEDOUT errors when fetching slow external images
 */
export function OptimizedImage({ fallback, ...props }: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  // For external Google images and slow CDNs, disable optimization
  const isExternalSlowImage =
    typeof props.src === "string" &&
    (props.src.includes("lh3.googleusercontent.com") ||
      props.src.includes("aida-public"));

  if (hasError) {
    return (
      fallback || (
        <div className="w-full h-full flex items-center justify-center bg-muted rounded">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
      )
    );
  }

  return (
    <Image
      {...props}
      unoptimized={isExternalSlowImage}
      onError={() => setHasError(true)}
    />
  );
}
