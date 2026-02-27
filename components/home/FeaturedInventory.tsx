import Link from "next/link";
import { OptimizedImage } from "@/components/optimized-image";

const featuredCars = [
  {
    make: "2024 Luxury Sedan",
    price: "$55,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLKy0S-ELhFQLI48pIsYgzeGbfGpC9lFCh62a1Y8GTTC_5i_TVtG7aESLOj0vb8hANKjVbVy9ofTf7y50MElgU0xjgqi5WQFPoDMLtCSBG9-jLl4YHCkKrBbEF7FkmCyoHioRVgHmJl3CSTnumvC3HUGymeov1jWXq-omuRZDu_VVaO8JFNGADnMvsDxCEbJ_NgB0icbU5wZJNcDhAqkh5yCniTLChfyMlGJCnZJhcwEWqWqtLOsYo4Ihk9gs_ZvP5lCxWBIlSINQh",
    badge: "New",
    specs: [
      { icon: "speed", text: "0 mi" },
      { icon: "settings", text: "Auto" },
    ],
  },
  {
    make: "2024 Sport SUV",
    price: "$62,500",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDp_UwSEi7s_dWm1G0vgodeBBq5ED2PGLFw78gz5q-RAyvcUcV5ruFvaS3fGvx5Fg8GHFk5XX0hUnIAv4xhY1brQOsTrFFD2CqisnuzsO8GVQNx6yKuk0O6dpaidqIZTqQ3JvMGWcy3dlOUGhfsImP6tJnjqQqri8_iQgqTzzpmwB4DbQlDl-p5MaPab-wEAvTbVXrAk0r9ruDgli1MCGmA3TaZCd8eSqYyHJOVrHU2i8Q9NsnjLqy53iMdx2gGy9f639oDGbpzygAn",
    badge: "New",
    specs: [
      { icon: "speed", text: "120 mi" },
      { icon: "settings", text: "AWD" },
    ],
  },
  {
    make: "2024 Electric Coupe",
    price: "$78,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7d7Eqr8ip8EbrJoJoTpuYxaNPIvYMPvpnY9RJ6QibmzUeHAj4-CBNaX72En9frAsc3dMoehfJSyzi6dLOheT0vlGEJO_eiOaduabF4XBYJMOId7-jBCseNbrY-T8bqo0W-adw7GJPEtqBpjkiFodvTyThVKxmgwy7NGJAV8RgNkE8jhBySWNQLwdYvy9ib_xgLdf6XwwgvuElCXdjex6v_iLbKGSW1dI6pbC2P6s4qdsWPLwd4dqL-ykVk8t-vWG9GrwOD1c91Gn6",
    badge: "Electric",
    badgeClass: "bg-green-100 text-green-700",
    specs: [
      { icon: "bolt", text: "320 mi range" },
      { icon: "settings", text: "Dual Motor" },
    ],
  },
];

export function FeaturedInventory() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Featured Inventory
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full"></div>
        </div>
        <Link
          href="/products"
          className="text-primary font-bold flex items-center gap-1 hover:underline"
        >
          Explore All{" "}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredCars.map((car, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700"
          >
            <div className="aspect-video overflow-hidden relative">
              <OptimizedImage
                alt={car.make}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                src={car.image}
                fill
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {car.make}
                </h3>
                <span
                  className={`${
                    car.badgeClass || "bg-primary/10 text-primary"
                  } text-xs font-bold px-2 py-1 rounded`}
                >
                  {car.badge}
                </span>
              </div>
              <p className="text-2xl font-black text-primary mb-4">
                {car.price}
              </p>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-6">
                {car.specs.map((spec, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">
                      {spec.icon}
                    </span>{" "}
                    {spec.text}
                  </span>
                ))}
              </div>
              <Link
                href="/products"
                className="block text-center border-2 border-primary text-primary font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
