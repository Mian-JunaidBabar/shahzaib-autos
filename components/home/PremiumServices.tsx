export function PremiumServices() {
  const services = [
    {
      icon: "sell",
      title: "Expert Sales",
      desc: "Our knowledgeable advisors help you find the perfect match for your requirements without any pressure.",
    },
    {
      icon: "build_circle",
      title: "Full Maintenance",
      desc: "Certified technicians using genuine parts to keep your vehicle performing at its peak for years to come.",
    },
    {
      icon: "payments",
      title: "Easy Financing",
      desc: "Competitive rates and flexible plans tailored to fit your budget and credit profile seamlessly.",
    },
  ];

  return (
    <section className="bg-primary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
            Our Premium Services
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We offer more than just sales. Discover how AM Motors takes care of
            you at every stage of your car ownership journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">
                  {service.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
