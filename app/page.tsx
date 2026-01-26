"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "@/context/theme-context";
import { CartProvider } from "@/context/cart-context";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Featured products data
const featuredProducts = [
  {
    id: 1,
    name: "7D Custom Mats",
    price: "$120",
    description:
      "Premium leather finish with custom fitting for all luxury car models.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSAQvQI9ZeWRLqqwHULo7hjYVRmv_zhv_VR_pJxNVVRZZq1o_6V4e9KRe8-A4eK7dkIFumbvk3az_zjwPIfDvUxlWDNWHcHDa8LJWuTzOleCQyUTu-4tHpdFnEDYsedlQkMFL9uVTaxwLChErCFvGD5ipgheJILWknsYoG4TV-HIPtwqMmyDLwjPyb4OaLx_hshMNacNnwo8K79j1SD8uSKb7eV3YvXakE082bGjx1EMJZVMxzrDksYSp4-Th1LTRgrLksjvAZ-d4N",
    badge: "BESTSELLER",
    slug: "7d-custom-mats",
  },
  {
    id: 2,
    name: "LED Projector Kit",
    price: "$250",
    description: "High-performance LED upgrade for superior night visibility.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEkjgKzomsWIoMV1OXiCPb-0zgpsuQYPf-imPBoqAJFZoqA0-EBUJMNAjFRSan16nAv1AVuaG7YINxpb4PLVUsEz8otwikp00yWVQcchjZ2B4CQcyW9BMpg64F1pwARYmy1WsOcVWSugSdX4AZuUZShXjTuxJLSs_sNC0VDS1Iy_PbUcJ4v7YURYrmCux9PsT3R0t8Jzm-jO2G9rV_gf4RqocbG23SrmvYwbYinqOcZ5prgzCVei0lxnK5TqWh-tjs1xA7G7GwDzEX",
    slug: "led-projector-kit",
  },
  {
    id: 3,
    name: "Ceramic Pro 9H",
    price: "$450",
    description:
      "Professional grade ceramic coating for ultimate paint protection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdT7hfoL0bBCuLu0_24Gaz4Ir9HPVZvWNSc6TaIs5OXLLzXvnkrwNEMH2PtnvYU5uwxuO95VEO-wOqlWH_9or9gMhXyIqphJ_K8BTT9WvNJEzT6c6FwwG-Yzle2k5D818OlVKlDxiigZnswdQdQwyo3lQW_0YaoSIXlRwji_3NHgzeHq0r221BBUVWUKJD4Fy7k12ikenxHjpOROfaNIOYZHvNQImHXut9RWaKw9d08nc2k64rC77L9nDcwMzKH-lnU_nw1nFQ8yl",
    slug: "ceramic-pro-9h",
  },
  {
    id: 4,
    name: "Deep Clean Package",
    price: "$85",
    description: "Complete interior detailing service with sanitization.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_oVI-2UEPOrPZpB27TYqA10_x94-4GfE9rwkHSs_PysDrRiCmv6MhMKtfOe-iHp8bH1CBlNr3JKpqikB9OxLmt4orgRZq-RL64g_9XYTNtYFEV0SkCPSDw7Rd5hvte5I7PlXrr6IOSIBbV0HzJt22TVLdHGYXuDnYdLjsyOZik029nPNYGToyzJ9z1ZVSxWCZXIgDbE3wMExaszFdFVwvLhqNx2n6Si5MwYK7plUz76lirgk55gQFYy64a6zzu8imjLNTFT209kq7",
    slug: "deep-clean-package",
  },
  {
    id: 5,
    name: "Caliper Painting",
    price: "$150",
    description: "Heat-resistant custom caliper painting in any color.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzshqibUkfnmrePsD-zVSkACmgO2hNkwpndq_7UQ1kt4FyFmkhbThcP0_mNceFX-Nz9VahL8EsW5eJYv1cnSRkqBHBtdYL7_GqozYjb7i6BqJXA73QfbD6Jcb_ONwZ8wdR6rqJBSHRHkJEZftj8_19v7DAeMDmNrxEfg_MjcH5sP_3e0LyWWCk6M7-KpT-J_wSn5NOpm8ULIb3rbIP5q5_nPfwwKmN78j_5S7lT2AEHrEQSTuSYhU1NrdF2t8f2SitGNwvksMKtUNi",
    slug: "caliper-painting",
  },
  {
    id: 6,
    name: "Full Body Wrap",
    price: "$1200+",
    description: "Premium vinyl wraps in matte, gloss, or satin finishes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
    badge: "TRENDING",
    badgeColor: "bg-blue-600",
    slug: "full-body-wrap",
  },
];

// Workshop stories data
const workshopStories = [
  {
    id: 1,
    title: "Ceramic Shield Applied",
    tag: "BMW M5",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY6_FRjny-7ukrMnaHP7SyHOd52sxr0WOXIqGH4SWrQcB4DUywiWldhuOAAZ7nHE3To6WeCrbrVvaK4P-az-Q9KFRAFv5JzZQLeuufS39qAGzrhLT_IHIOBEG062Ox7-TjUyOuwcNPR7MXwHkdunto0iyihWPkmtLA6v-meesPztESn25FeiF4FQegDCAPSJPEPcYDXBfRyxUG9zEPFMJjJc2JdGCw3jra8edLqVfjX8uP8vB2wEHNuXYdq7GtdGL2q2BtnG0fadTf",
    description: "Full body protection package.",
  },
  {
    id: 2,
    title: "Vintage Interior Restore",
    tag: "CLASSIC",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAnU8s7DRK05vvR4-i9TX8ECgP8QvLGbjgOB7N3JiPM7Tkx9Y0qWbdhVYzI7RFlEYXaitEbWvV6t5seDCaQZuQymlp_XTueVHAX0zt1gsbh0w9rANbLF9t2vEH4IKs8mcAtxyjhcpdh0d7zgZUESohfW-Hb1LoAGL1ozmgQDSq1qLDmMIcXpQTotUmhFbrnO6ZM0e5Xbe3T6HcXmJBefZ11Sjqnyvjd6H2tBo7dtMpfgtsgeUVz-zdnuZcsHBLM5WIqH0KBRt3dqTP",
  },
  {
    id: 3,
    title: "Engine Bay Detailing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoAbH75labLjI9IYarI3itXkkAQs2tKh0MhYLu3FpC-wPAUchj2nvP-ET-jZ65bmh8lOd-JlmtUF1QqR_qYshro76zifGO7J7Vl_Ynz4QbsMOpKd5_rfx4RVfCnDXCay2G7JqnygWg6MrIWXgS2FLTSxI612OsefrwVsVYVJRTlNrpXT6jXbDtYUJFWm6l0sE855BarVs3DMHwZjImgSv0k_7w3NRqwVz0rbcFXI4i2mHN2h4gYvCuj5e_dk2oSMFO2pQU98546QdZ",
  },
  {
    id: 4,
    title: "Premium Foam Wash",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAsNjiTVLWvrLKmOCn_eY4KoH9IEqKh8kLiGPRpnQqKKwK1NdvRZjOBzhLltRyPRVfXY01e7wMweBzddy9TsxhKqV4zx0I5mBaeeXc97cQtLMcPA_iqCJuY8Ezqt3LMwXgim5ijzKjsVKiFW3sBFrAZIWCiewsmoG9ZHD98rxNdieDu2P-NN3XB13EAQ79X2zUt0F8luVDj854-nqMhqqIP4hRZKK5JRSZr1kf5z6sNbMMXTl9RrYnzIqgInkYuoV8OhDAhlp1YYlSx",
  },
  {
    id: 5,
    title: "Satin Blue Wrap",
    tag: "CORVETTE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
  },
];

// Features data
const features = [
  {
    icon: "engineering",
    title: "Professional Install",
    description: "Certified experts handling your car.",
  },
  {
    icon: "payments",
    title: "Cash on Delivery",
    description: "Pay only when you are satisfied.",
  },
  {
    icon: "diamond",
    title: "Premium Areas",
    description: "Serving exclusive locations & brands.",
  },
  {
    icon: "verified_user",
    title: "Trusted by 5k+",
    description: "5-star rated automotive service.",
  },
];

export default function HomePage() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Header />
          <>
            {/* Hero Section */}
            <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background transition-colors duration-300">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 -z-10 h-125 w-125 bg-primary/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 -z-10 h-75 w-75 bg-blue-600/10 blur-[80px] rounded-full" />

              <div className="px-4 md:px-8 lg:px-40">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="flex flex-col gap-6 order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit">
                      <span className="material-symbols-outlined text-[14px]">
                        stars
                      </span>
                      <span>No.1 Automotive Workshop</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-text-primary">
                      Premium Car Accessories &{" "}
                      <span className="text-primary">
                        Professional Installation
                      </span>
                    </h1>

                    <p className="text-text-muted text-lg leading-relaxed max-w-lg">
                      Transform your vehicle with high-quality parts and expert
                      craftsmanship. From detailing to custom modifications, we
                      do it all.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2">
                      <Link
                        href="/products"
                        className="h-11 px-8 rounded-md bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        Explore Catalog
                      </Link>
                      <Link
                        href="/booking"
                        className="h-11 px-8 rounded-md bg-transparent border border-border text-text-primary font-semibold text-sm hover:bg-muted transition-all flex items-center gap-2"
                      >
                        Book Service
                      </Link>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="relative order-1 lg:order-2 group">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD00zIN8_8SUI957_XQfS6bdXzkF4h4SSmjbn2D2wb45ibyAeOkX4uTwlfDsLVBtlrOlGIY5b4GthE_pePfduRbgvuxodWHJbA_QWGdadmVd3E-q5Mck8cKfpQMpsXgawOTUI0ITAZIaGyV83r5YU3oo-jIaT8CeVuzed5iBjquC8T6ElhCa25PUA35oq1nnFTyvOZ3l712lAAfel2Bq8mrZMjjjbeYV8dVPdxJdQLgKpOaHllimldqfaIVTX8iQLmEMaHthfqp7JBw"
                        alt="Cinematic shot of workshop activity"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                          <span className="material-symbols-outlined text-white text-3xl">
                            play_arrow
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
                        <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
                        Live from Workshop
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="border-y border-border bg-section-bg transition-colors duration-300">
              <div className="px-4 md:px-8 lg:px-40 py-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature) => (
                    <div key={feature.title} className="flex flex-col gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          {feature.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-base">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-text-muted mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 px-4 md:px-8 lg:px-40 bg-background transition-colors duration-300">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                    Featured Products
                  </h2>
                  <p className="text-text-muted mt-2">
                    Best-selling upgrades for your car.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:flex text-primary text-sm font-semibold items-center gap-1 hover:gap-2 transition-all"
                >
                  View Catalog{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden bg-muted relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.badge && (
                        <div
                          className={`absolute top-3 right-3 ${product.badgeColor || "bg-primary"} text-white text-[10px] font-bold px-2 py-1 rounded`}
                        >
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-text-primary">
                          {product.name}
                        </h3>
                        <span className="font-medium text-text-muted">
                          {product.price}
                        </span>
                      </div>
                      <p className="text-sm text-text-subtle mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <a
                        href="https://wa.me/15551234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-10 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-sm font-medium border border-[#25D366]/20 flex items-center justify-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chat
                        </span>
                        Order via WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Workshop Stories Section */}
            <section className="py-20 px-4 md:px-8 lg:px-40 bg-section-bg transition-colors duration-300">
              <div className="mb-12 text-center max-w-2xl mx-auto">
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">
                  Our Portfolio
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4">
                  Workshop Stories
                </h2>
                <p className="text-text-muted text-lg">
                  Real results from our garage. See how we upgrade everyday
                  rides into dream machines.
                </p>
              </div>

              <div className="masonry-grid">
                {workshopStories.map((story) => (
                  <div
                    key={story.id}
                    className="masonry-item break-inside-avoid mb-6 group relative rounded-xl overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={story.image}
                      alt={story.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      {story.tag && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {story.tag}
                          </span>
                        </div>
                      )}
                      <h4 className="text-white font-bold text-lg">
                        {story.title}
                      </h4>
                      {story.description && (
                        <p className="text-slate-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {story.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
                >
                  View All Stories{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-8 lg:px-40">
              <div className="relative overflow-hidden rounded-2xl bg-primary text-white px-8 py-16 md:px-16 text-center shadow-2xl">
                <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-white text-3xl md:text-5xl font-black mb-6 tracking-tight">
                    Ready to Transform Your Ride?
                  </h2>
                  <p className="text-white/80 text-lg md:text-xl mb-8 font-medium">
                    Join thousands of satisfied customers. Book your appointment
                    today or order premium parts directly to your doorstep.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/booking"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-bold text-base hover:bg-white/90 transition-colors shadow-lg"
                    >
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      Book Appointment
                    </Link>
                    <a
                      href="https://wa.me/15551234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-lg font-bold text-base hover:bg-[#20bd5a] transition-colors shadow-lg"
                    >
                      <span className="material-symbols-outlined">chat</span>
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
