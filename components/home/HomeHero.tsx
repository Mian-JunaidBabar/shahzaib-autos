import Link from "next/link";
import { OptimizedImage } from "@/components/optimized-image";

export function HomeHero() {
  return (
    <section className="relative h-[600px] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <OptimizedImage
          alt="Premium Car"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1xXYKuB9H-gpcupKdZ2ix2vKv5UJmtNW3fMmZrsRLi5FC3giEAkSyFDM38qSC1dqNxr0-VVRFFISqKAdXQ5SwYW00luEsXKXhbNf7FQWm2mI8A86uZsX9Cpnyk_VB5UyRez4SIJwUHFoW2aXW85CVdhCbFgpMnhAiNT1yVtSlNtU2MHlMYnEk0exObSYEkznDMaVA6XFffJCo9RRTDs-n0cTW9-qJXD6D2UQXNlbbmr_f0hv1_27DUPCDYNV2cU33YI9jR_194e_O"
          fill
        />
      </div>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4">
            Drive Your <span className="text-primary">Dreams</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg">
            Experience the ultimate collection of premium vehicles tailored to
            your lifestyle. Find excellence in every detail.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-base hover:scale-105 transition-transform"
            >
              View Inventory
            </Link>
            <Link
              href="/contact"
              className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-base hover:bg-slate-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
