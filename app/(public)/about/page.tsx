import { AboutOrigin } from "@/components/about/AboutOrigin";
import { ContactCTA } from "@/components/about/ContactCTA";
import { TeamGrid } from "@/components/about/TeamGrid";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      {/* Minimal Hero Header */}
      <div className="bg-slate-900 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          About Us
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          The engineers behind the world&apos;s most exclusive automotive
          upgrades.
        </p>
      </div>

      <main className="flex-1 w-full pb-24">
        <AboutOrigin />
        <TeamGrid />

        {/* Call‑to‑action prompting users to visit the contact page */}
        <div className="mt-12">
          <ContactCTA />
        </div>
      </main>
    </div>
  );
}
