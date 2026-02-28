import { OptimizedImage } from "@/components/optimized-image";

export function WeeklyBestSellers() {
  const sellers = [
    {
      title: "Custom Fit Floor Mats",
      desc: "5D Diamond quilted waterproof leather mats tailored for your specific car model.",
      price: "$120.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAI-hE99NMADuOOCbJnhKYKecXLHFKsahvpbnZitpZI683o2Hi2jz8-viRTGd2c2DNqR_cuKAoDcuhgoHLaTlBq-CS4XQHaSPUs1JJt8gvRyqENVeWj6fqNoy89fHPCrH1ZiiJNirYpv5fnz4addsocatG6MCgmVLNhO1bORAc_88Jq6G_QebaJ3aGRCJFLl4KTSvkvuAaSuyzOH1-CBncsYfQT9Av-9otdCLCBD2Yp_q_ZcsenoFgAJWvvl4p7tQj9rOeBfAFZ07VJ",
    },
    {
      title: "All-Weather Car Cover",
      desc: "6-Layer breathable material with UV protection and elasticized heavy-duty hems.",
      price: "$75.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBV9FCQBCStGliRhBrJ5RDAkbyR1nGbmuEWGUp8O529MduUji_ASTDqQZ64mov_ErZc7x7UsfoWFn9hDl1EyzDayTiAUKEut_7SIbR1XDwvd2E_NfPzKx6ztQBRE9lDyuMQAD4dqgMYrCstpNqn00SBfGWkhgYQlP-Db-SrNQW4KVu64dRLgXm82qOlAklFwiz28EGd9jQ0HAucHuTqW2YYqkhvcpDyQAFfZTtpdrRW8Nxw7GIqjvh-m4Pkf1NCvthCCcq_TqneXtKC",
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Weekly Best Sellers
        </h2>
        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sellers.map((item, idx) => (
          <div
            key={idx}
            className="flex bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform group"
          >
            <div className="w-1/3 aspect-square rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
              <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                BESTSELLER
              </span>
              <OptimizedImage
                alt={item.title}
                src={item.image}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="ml-6 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                {item.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-black text-xl">
                  {item.price}
                </span>
                <button className="flex items-center gap-2 text-sm font-bold border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
