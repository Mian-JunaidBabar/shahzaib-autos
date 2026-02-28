export function ProcessTimeline() {
  const steps = [
    { icon: "chat", title: "Consultation", desc: "Goal setting & concept" },
    { icon: "architecture", title: "Design", desc: "3D Renders & specs" },
    { icon: "build", title: "Installation", desc: "Expert craftsmanship" },
    { icon: "verified", title: "Delivery", desc: "Quality inspection" },
  ];

  return (
    <section className="px-4 py-20 bg-slate-50 dark:bg-slate-900/40 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-slate-900 dark:text-white text-3xl font-black mb-4">
            The Shahzaib Autos Process
          </h2>
          <div className="h-1.5 w-16 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="size-20 lg:size-24 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-primary flex justify-center items-center shadow-lg group-hover:scale-110 group-hover:border-primary transition-all duration-300 mb-6 relative bg-clip-padding">
                <span className="material-symbols-outlined text-3xl lg:text-4xl">
                  {step.icon}
                </span>
                <span className="absolute -top-3 -right-3 size-8 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {idx + 1}
                </span>
              </div>
              <h4 className="text-slate-900 dark:text-white text-lg font-bold mb-2">
                {step.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
