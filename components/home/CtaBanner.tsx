export function CtaBanner() {
  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            Ready to take the wheel?
          </h2>
          <p className="text-white/80 text-lg">
            Schedule your personalized test drive today and feel the difference.
          </p>
        </div>
        <button className="bg-white text-primary px-10 py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-2xl transition-all whitespace-nowrap">
          Schedule a Test Drive
        </button>
      </div>
    </section>
  );
}
