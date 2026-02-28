import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import { ServicesHero } from "@/components/services/ServicesHero";
import { CoreServices } from "@/components/services/CoreServices";
import { ProcessTimeline } from "@/components/services/ProcessTimeline";
import { ServicesCta } from "@/components/services/ServicesCta";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Header />

      <main className="flex-1 w-full pb-24">
        {/* Cinematic Hero */}
        <ServicesHero />

        {/* Zig-Zag Services Overview */}
        <CoreServices />

        {/* Step-by-Step Flow */}
        <ProcessTimeline />

        {/* Final Conversion Banner */}
        <ServicesCta />
      </main>

      <Footer />
    </div>
  );
}
