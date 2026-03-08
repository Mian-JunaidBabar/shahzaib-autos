import { useEffect, useState } from "react";

/**
 * useScroll Hook
 *
 * Detects if user has scrolled past a certain threshold.
 * Useful for adding scroll-based animations/effects (e.g., navbar shadow).
 *
 * @param threshold - Scroll distance in pixels to trigger the effect (default: 10px)
 * @returns Boolean indicating if user has scrolled past threshold
 */
export function useScroll(threshold: number = 10): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
