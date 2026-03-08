import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Sparkles,
  Music,
  Shield,
  CarFront,
  Zap,
} from "lucide-react";

export function ServiceMarquee() {
  const services = [
    { name: "Professional Installation", icon: Wrench },
    { name: "Custom Ambient Lighting", icon: Sparkles },
    { name: "Premium Audio Tuning", icon: Music },
    { name: "Ceramic Coating", icon: Shield },
    { name: "Car Wrapping & Detailing", icon: CarFront },
    { name: "Performance Upgrades", icon: Zap },
  ];

  // Duplicate arrays to ensure seamless infinite looping
  const duplicatedServices = [
    ...services,
    ...services,
    ...services,
    ...services,
  ];

  return (
    <section className="py-12 bg-slate-900 border-y border-red-600/20 overflow-hidden relative mt-12 mb-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-red-900/20 via-slate-900 to-slate-900 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Expert Installation &{" "}
              <span className="text-red-500">Services</span>
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl">
              Beyond premium parts, we offer professional installation and
              detailing services to transform your ride.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20"
          >
            Book a Consultation <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] mt-8 relative">
          <div className="flex shrink-0 animate-marquee-left gap-4 hover:[animation-play-state:paused] w-max">
            {duplicatedServices.map((service, i) => (
              <div
                key={`service-${i}`}
                className="flex items-center gap-3 px-6 h-16 shrink-0 rounded-xl border border-slate-700 bg-slate-800/80 text-white font-bold uppercase tracking-wider text-sm hover:border-red-500 hover:text-red-500 transition-all cursor-pointer box-border backdrop-blur-sm shadow-xl"
              >
                <service.icon size={20} className="text-red-500" />
                {service.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
