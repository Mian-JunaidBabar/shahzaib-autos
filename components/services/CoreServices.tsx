export function CoreServices() {
  const services = [
    {
      title: "Audio & Multimedia",
      desc: "Immersive sound systems and state-of-the-art infotainment upgrades tailored for acoustic perfection.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuArFO_fSHx6VzuA8nHmR3YApctbLbe40tqZ1wt-mZZQg66TO3K34fjkWNTY_f-tHPmCmkJUkgnkRkz_aJJbrI76PAPNxogDYVao3qE-t4VAF40JBNZkn1o4r-NbJE--6TvE26SmuEJzE2gGshK5x2W2nQwcis5DUc0lKFCnRgwUavapNkdbWRvVqmrpkBrLiQfO0GrOX_dfNagSskYDV-saE2LP0_29Hx4vpf0eXLS_5AaXoydAXZz896P76HKkfV7fJmGWLWWtN6As",
    },
    {
      title: "Performance Tuning",
      desc: "Unlock your engine's true potential with custom ECU remapping and precision hardware upgrades.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBsFPZz0bGJOUvoqVR0-CIj9iN-ht5jnYvQQcH3ZjfIYeHVaGPMgrGg-kKwe0G7GUfcRl12iBQZUpP2YfZBY25miViOlPysGgP_v-mwMLFi7t1FJBm1tIrpJaDsZhzhYiiz8A4CRJ4rp3rKKlOD3QLRnMVmHI5EvtGpT5qrRNYl4bkQ_wQQVXLriNmO5MRAkAJpmd3_HSemDd4_c2QPDfXsyAuv6vnGr9AE1lH4QH3R9c-wEpLA9Xim1zLYRJcw64EMHxW2nOGSEKxD",
    },
    {
      title: "Exterior Styling",
      desc: "From premium vinyl wraps to bespoke aero kits, we redefine your vehicle's visual identity.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBesSfzZfB6225piTHtCo3ZdHYdf3K-xYujXUyi-vFN2ixlk0ADJMmz3g7dmUueV-L62wHywpBbU-_-tabsZMlVtql_qykgoyb80tYiD4SnJxin3DyZSwi-APR3f3qFwtmRcOIO7jXBoXT1u_0ADTjwnqYwiTImnQeqCE0zOH_yc29BXbp_zlOguqZNo9rNDCS9OsWlF3II7tYcZNQ_vy16yiOMyZvvQ2n7rXoH35VtazyOd0nm-3OSdEhfqY2q8YbZJmDpX-g0BnRf",
    },
  ];

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col gap-2 items-center text-center">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black">
          Our Core Services
        </h2>
        <div className="h-1.5 w-16 bg-primary rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="h-56 w-full bg-cover bg-center overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url("${service.image}")` }}
              />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                {service.desc}
              </p>
              <button className="w-full h-12 rounded-xl bg-primary/10 hover:bg-primary dark:bg-primary/20 dark:hover:bg-primary text-primary hover:text-white text-sm font-bold transition-colors">
                View Pricing
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
