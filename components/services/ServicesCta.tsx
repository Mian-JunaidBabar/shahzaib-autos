export function ServicesCta() {
  return (
    <section className="p-4 py-24 max-w-5xl mx-auto w-full">
      <div className="rounded-[2rem] p-12 md:p-16 bg-primary flex flex-col items-center text-center gap-6 shadow-2xl shadow-primary/40 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 size-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <h3 className="text-white text-4xl md:text-5xl font-black relative z-10">
          Ready to transform?
        </h3>
        <p className="text-white/90 text-lg relative z-10 max-w-md">
          Schedule your premium session today to consult with our master
          technicians.
        </p>

        <div className="mt-4 relative z-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button className="flex-1 bg-white hover:bg-slate-50 text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:-translate-y-1 transition-all duration-300">
            Book Appointment
          </button>
          <button className="flex-1 bg-primary border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors duration-300">
            View Pricing
          </button>
        </div>
      </div>
    </section>
  );
}
