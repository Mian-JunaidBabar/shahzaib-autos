export function BrandSlider() {
  const vehicleBrands = [
    { name: "Toyota" },
    { name: "Honda" },
    { name: "Suzuki" },
    { name: "Kia" },
    { name: "Nissan" },
    { name: "Daihatsu" },
  ];

  const techBrands = [
    { name: "Pioneer" },
    { name: "JBL" },
    { name: "Kenwood" },
    { name: "Sony" },
    { name: "Nakamichi" },
    { name: "Sansui" },
  ];

  return (
    <section className="py-12 bg-white/50 dark:bg-background-dark/50 border-y border-primary/10">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
          Our Trusted Partner Brands
        </h3>
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {vehicleBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-600 font-bold uppercase tracking-wider text-sm hover:border-primary hover:text-primary hover:shadow-md transition-all cursor-pointer"
              >
                {brand.name}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 lg:translate-x-6">
            {techBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center px-6 py-3 rounded-full border border-slate-300 bg-transparent text-slate-600 font-bold uppercase tracking-wider text-sm hover:border-primary hover:text-primary hover:shadow-md transition-all cursor-pointer"
              >
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
