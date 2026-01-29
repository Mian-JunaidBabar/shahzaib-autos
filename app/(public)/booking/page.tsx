import { BookingForm } from "@/components/public/booking-form";
import { ChevronLeft } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

export default function BookingPage() {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-section-bg pt-6 pb-6 transition-colors duration-300">
        <div className="px-4 md:px-8 lg:px-40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-text-primary">
            Book Installation
          </h1>
          <p className="text-text-muted mt-2">
            Schedule a home visit from our expert technicians
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <BookingForm />
        </Suspense>
      </section>
    </>
  );
}
