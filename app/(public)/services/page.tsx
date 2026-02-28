import { ServicesHero } from "@/components/services/ServicesHero";
import { CoreServices } from "@/components/services/CoreServices";
import { ProcessTimeline } from "@/components/services/ProcessTimeline";
import { ServicesCta } from "@/components/services/ServicesCta";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <main className="flex-1 w-full pb-24">
        {/* Cinematic Hero */}
        <ServicesHero />

        {/* Dynamic Services Overview from DB */}
        <CoreServices dbServices={services} />

        {/* Step-by-Step Flow */}
        <ProcessTimeline />

        {/* Final Conversion Banner */}
        <ServicesCta />
      </main>
    </div>
  );
}
