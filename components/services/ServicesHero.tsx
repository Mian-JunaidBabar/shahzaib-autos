import Link from "next/link";

export function ServicesHero() {
  return (
    <section className="relative px-4 py-8 max-w-7xl mx-auto w-full">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-4/5 md:aspect-21/9 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-tr from-slate-900 via-slate-900/60 to-primary/20 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0"></div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-slate-100 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Elevate <br className="md:hidden" />
            Your Ride
          </h1>
          <p className="text-slate-300 text-lg font-normal max-w-md mx-auto">
            Premium automotive customization services for the modern enthusiast.
            From aero styling to acoustic tuning.
          </p>
          <Link
            href="/contact"
            className="mt-8 flex w-full max-w-60 mx-auto cursor-pointer items-center justify-center rounded-xl h-14 bg-white text-slate-900 dark:bg-white dark:text-slate-900 text-base font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all"
          >
            Book a Consultation
          </Link>
        </div>

        <div
          className="absolute inset-0 z-[-1] opacity-40 hero-background"
          aria-label="Dark luxury sports car front view"
        />
      </div>
    </section>
  );
}
