"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Products data
const products = [
  {
    id: 1,
    name: "7D Custom Mats",
    price: "$120",
    description:
      "Premium leather finish with custom fitting for all luxury car models. Waterproof and easy to clean.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSAQvQI9ZeWRLqqwHULo7hjYVRmv_zhv_VR_pJxNVVRZZq1o_6V4e9KRe8-A4eK7dkIFumbvk3az_zjwPIfDvUxlWDNWHcHDa8LJWuTzOleCQyUTu-4tHpdFnEDYsedlQkMFL9uVTaxwLChErCFvGD5ipgheJILWknsYoG4TV-HIPtwqMmyDLwjPyb4OaLx_hshMNacNnwo8K79j1SD8uSKb7eV3YvXakE082bGjx1EMJZVMxzrDksYSp4-Th1LTRgrLksjvAZ-d4N",
    badge: "BESTSELLER",
    category: "interior",
    slug: "7d-custom-mats",
  },
  {
    id: 2,
    name: "LED Projector Kit",
    price: "$250",
    description:
      "High-performance LED upgrade for superior night visibility. Plug and play installation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEkjgKzomsWIoMV1OXiCPb-0zgpsuQYPf-imPBoqAJFZoqA0-EBUJMNAjFRSan16nAv1AVuaG7YINxpb4PLVUsEz8otwikp00yWVQcchjZ2B4CQcyW9BMpg64F1pwARYmy1WsOcVWSugSdX4AZuUZShXjTuxJLSs_sNC0VDS1Iy_PbUcJ4v7YURYrmCux9PsT3R0t8Jzm-jO2G9rV_gf4RqocbG23SrmvYwbYinqOcZ5prgzCVei0lxnK5TqWh-tjs1xA7G7GwDzEX",
    category: "lighting",
    slug: "led-projector-kit",
  },
  {
    id: 3,
    name: "Ceramic Pro 9H",
    price: "$450",
    description:
      "Professional grade ceramic coating for ultimate paint protection and high gloss finish.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdT7hfoL0bBCuLu0_24Gaz4Ir9HPVZvWNSc6TaIs5OXLLzXvnkrwNEMH2PtnvYU5uwxuO95VEO-wOqlWH_9or9gMhXyIqphJ_K8BTT9WvNJEzT6c6FwwG-Yzle2k5D818OlVKlDxiigZnswdQdQwyo3lQW_0YaoSIXlRwji_3NHgzeHq0r221BBUVWUKJD4Fy7k12ikenxHjpOROfaNIOYZHvNQImHXut9RWaKw9d08nc2k64rC77L9nDcwMzKH-lnU_nw1nFQ8yl",
    category: "carcare",
    slug: "ceramic-pro-9h",
  },
  {
    id: 4,
    name: "Premium Body Wrap",
    price: "$1,200+",
    description:
      "Premium vinyl wraps in matte, gloss, or satin finishes. Protects original paint.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
    badge: "TRENDING",
    badgeColor: "bg-blue-600",
    category: "exterior",
    slug: "premium-body-wrap",
  },
  {
    id: 5,
    name: "Deep Clean Package",
    price: "$85",
    description:
      "Complete interior detailing service with sanitization and upholstery protection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_oVI-2UEPOrPZpB27TYqA10_x94-4GfE9rwkHSs_PysDrRiCmv6MhMKtfOe-iHp8bH1CBlNr3JKpqikB9OxLmt4orgRZq-RL64g_9XYTNtYFEV0SkCPSDw7Rd5hvte5I7PlXrr6IOSIBbV0HzJt22TVLdHGYXuDnYdLjsyOZik029nPNYGToyzJ9z1ZVSxWCZXIgDbE3wMExaszFdFVwvLhqNx2n6Si5MwYK7plUz76lirgk55gQFYy64a6zzu8imjLNTFT209kq7",
    category: "interior",
    slug: "deep-clean-package",
  },
  {
    id: 6,
    name: "Caliper Painting",
    price: "$150",
    description:
      "Heat-resistant custom caliper painting in any color to match your style.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzshqibUkfnmrePsD-zVSkACmgO2hNkwpndq_7UQ1kt4FyFmkhbThcP0_mNceFX-Nz9VahL8EsW5eJYv1cnSRkqBHBtdYL7_GqozYjb7i6BqJXA73QfbD6Jcb_ONwZ8wdR6rqJBSHRHkJEZftj8_19v7DAeMDmNrxEfg_MjcH5sP_3e0LyWWCk6M7-KpT-J_wSn5NOpm8ULIb3rbIP5q5_nPfwwKmN78j_5S7lT2AEHrEQSTuSYhU1NrdF2t8f2SitGNwvksMKtUNi",
    category: "exterior",
    slug: "caliper-painting",
  },
  {
    id: 7,
    name: "Leather Upholstery",
    price: "$800+",
    description:
      "Custom hand-stitched leather upholstery restoration for classic and modern vehicles.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAnU8s7DRK05vvR4-i9TX8ECgP8QvLGbjgOB7N3JiPM7Tkx9Y0qWbdhVYzI7RFlEYXaitEbWvV6t5seDCaQZuQymlp_XTueVHAX0zt1gsbh0w9rANbLF9t2vEH4IKs8mcAtxyjhcpdh0d7zgZUESohfW-Hb1LoAGL1ozmgQDSq1qLDmMIcXpQTotUmhFbrnO6ZM0e5Xbe3T6HcXmJBefZ11Sjqnyvjd6H2tBo7dtMpfgtsgeUVz-zdnuZcsHBLM5WIqH0KBRt3dqTP",
    category: "interior",
    slug: "leather-upholstery",
  },
  {
    id: 8,
    name: "Engine Detailing",
    price: "$95",
    description:
      "Safe and thorough engine bay cleaning and dressing to make your engine look brand new.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoAbH75labLjI9IYarI3itXkkAQs2tKh0MhYLu3FpC-wPAUchj2nvP-ET-jZ65bmh8lOd-JlmtUF1QqR_qYshro76zifGO7J7Vl_Ynz4QbsMOpKd5_rfx4RVfCnDXCay2G7JqnygWg6MrIWXgS2FLTSxI612OsefrwVsVYVJRTlNrpXT6jXbDtYUJFWm6l0sE855BarVs3DMHwZjImgSv0k_7w3NRqwVz0rbcFXI4i2mHN2h4gYvCuj5e_dk2oSMFO2pQU98546QdZ",
    category: "carcare",
    slug: "engine-detailing",
  },
  {
    id: 9,
    name: "Satin Blue Wrap",
    price: "$1,500",
    description:
      "Limited edition Satin Blue wrap for sports cars. Includes full surface preparation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
    category: "exterior",
    slug: "satin-blue-wrap",
  },
];

// Category filters
const categories = [
  { id: "all", label: "All Products" },
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "lighting", label: "Lighting" },
  { id: "mats", label: "Mats & Flooring" },
  { id: "carcare", label: "Car Care" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Header Section */}
      <section className="border-b border-[#1e293b] bg-[#0f172a]/30 pt-8 pb-8">
        <div className="px-4 md:px-8 lg:px-40">
          <nav className="flex items-center text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#3b82f6] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <Link
              href="/products"
              className="hover:text-[#3b82f6] transition-colors"
            >
              Catalog
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-white font-medium">Car Accessories</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Car Accessories
              </h1>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Premium upgrades for interior comfort, exterior styling, and
                vehicle protection. Professional installation available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-40 border-b border-[#1e293b] bg-[#020817]/95 backdrop-blur supports-backdrop-filter:bg-[#020817]/60">
        <div className="px-4 md:px-8 lg:px-40 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Category Filters */}
            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category.id
                        ? "border-[#3b82f6] bg-[#3b82f6] text-white shadow-sm"
                        : "border-[#1e293b] bg-[#0f172a] text-slate-400 hover:bg-[#1e293b] hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-auto relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </span>
              <input
                type="text"
                placeholder="Search accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full md:w-64 rounded-md border border-[#1e293b] bg-[#0f172a] px-3 py-2 pl-10 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-xl border border-[#1e293b] bg-[#0f172a] overflow-hidden hover:border-[#3b82f6]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#3b82f6]/5"
            >
              <div className="aspect-4/3 w-full overflow-hidden bg-[#1e293b] relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <div
                    className={`absolute top-3 right-3 ${product.badgeColor || "bg-[#3b82f6]"} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm`}
                  >
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-white group-hover:text-[#3b82f6] transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-bold text-white">{product.price}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link
                    href={`/products/${product.slug}`}
                    className="h-10 rounded-md border border-[#1e293b] bg-transparent hover:bg-[#1e293b] hover:text-white text-slate-300 text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    View Details
                  </Link>
                  <a
                    href="https://wa.me/15551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chat
                    </span>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 flex justify-center">
          <button className="px-6 py-2 rounded-md border border-[#1e293b] bg-[#0f172a] hover:bg-[#1e293b] hover:text-white text-slate-400 font-medium text-sm transition-colors flex items-center gap-2">
            Load More Products
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
        </div>
      </section>
    </>
  );
}
