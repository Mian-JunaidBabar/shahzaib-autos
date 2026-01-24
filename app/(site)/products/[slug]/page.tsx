"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { use } from "react";

// Products data (in a real app, this would come from a database/API)
const products = [
  {
    id: 1,
    name: "7D Custom Mats",
    price: "$120",
    description:
      "Premium leather finish with custom fitting for all luxury car models. Waterproof and easy to clean.",
    longDescription:
      "Our 7D Custom Mats are designed for the discerning car enthusiast who demands nothing but the best. Crafted with precision-cut materials and featuring a premium leather finish, these mats provide both luxury aesthetics and superior protection for your vehicle's flooring. Each set is custom-fitted to your specific car make and model for a seamless, factory-like appearance.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSAQvQI9ZeWRLqqwHULo7hjYVRmv_zhv_VR_pJxNVVRZZq1o_6V4e9KRe8-A4eK7dkIFumbvk3az_zjwPIfDvUxlWDNWHcHDa8LJWuTzOleCQyUTu-4tHpdFnEDYsedlQkMFL9uVTaxwLChErCFvGD5ipgheJILWknsYoG4TV-HIPtwqMmyDLwjPyb4OaLx_hshMNacNnwo8K79j1SD8uSKb7eV3YvXakE082bGjx1EMJZVMxzrDksYSp4-Th1LTRgrLksjvAZ-d4N",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_oVI-2UEPOrPZpB27TYqA10_x94-4GfE9rwkHSs_PysDrRiCmv6MhMKtfOe-iHp8bH1CBlNr3JKpqikB9OxLmt4orgRZq-RL64g_9XYTNtYFEV0SkCPSDw7Rd5hvte5I7PlXrr6IOSIBbV0HzJt22TVLdHGYXuDnYdLjsyOZik029nPNYGToyzJ9z1ZVSxWCZXIgDbE3wMExaszFdFVwvLhqNx2n6Si5MwYK7plUz76lirgk55gQFYy64a6zzu8imjLNTFT209kq7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAnU8s7DRK05vvR4-i9TX8ECgP8QvLGbjgOB7N3JiPM7Tkx9Y0qWbdhVYzI7RFlEYXaitEbWvV6t5seDCaQZuQymlp_XTueVHAX0zt1gsbh0w9rANbLF9t2vEH4IKs8mcAtxyjhcpdh0d7zgZUESohfW-Hb1LoAGL1ozmgQDSq1qLDmMIcXpQTotUmhFbrnO6ZM0e5Xbe3T6HcXmJBefZ11Sjqnyvjd6H2tBo7dtMpfgtsgeUVz-zdnuZcsHBLM5WIqH0KBRt3dqTP",
    ],
    badge: "BESTSELLER",
    category: "interior",
    slug: "7d-custom-mats",
    features: [
      "Premium quality leather finish",
      "Custom-cut for your exact car model",
      "Multi-layer waterproof protection",
      "Anti-slip bottom layer",
      "Easy to clean and maintain",
      "UV resistant, no fading over time",
    ],
    specifications: [
      { label: "Material", value: "Premium PU Leather + XPE" },
      { label: "Layers", value: "7-layer construction" },
      { label: "Waterproof", value: "Yes, full coverage" },
      { label: "Warranty", value: "1 Year Manufacturer" },
      { label: "Fitment", value: "Custom for your vehicle" },
      { label: "Installation", value: "Professional (Included)" },
    ],
  },
  {
    id: 2,
    name: "LED Projector Kit",
    price: "$250",
    description:
      "High-performance LED upgrade for superior night visibility. Plug and play installation.",
    longDescription:
      "Transform your night driving experience with our premium LED Projector Kit. Designed for enthusiasts who demand optimal visibility and a modern look, this kit delivers brilliant, focused illumination while maintaining proper beam patterns to avoid blinding oncoming traffic.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEkjgKzomsWIoMV1OXiCPb-0zgpsuQYPf-imPBoqAJFZoqA0-EBUJMNAjFRSan16nAv1AVuaG7YINxpb4PLVUsEz8otwikp00yWVQcchjZ2B4CQcyW9BMpg64F1pwARYmy1WsOcVWSugSdX4AZuUZShXjTuxJLSs_sNC0VDS1Iy_PbUcJ4v7YURYrmCux9PsT3R0t8Jzm-jO2G9rV_gf4RqocbG23SrmvYwbYinqOcZ5prgzCVei0lxnK5TqWh-tjs1xA7G7GwDzEX",
    ],
    category: "lighting",
    slug: "led-projector-kit",
    features: [
      "50,000+ hour lifespan",
      "6000K pure white output",
      "Built-in CAN bus decoder",
      "Plug and play installation",
      "DOT approved beam pattern",
      "Aluminum heat sink cooling",
    ],
    specifications: [
      { label: "Lumens", value: "12,000 per pair" },
      { label: "Color Temp", value: "6000K Pure White" },
      { label: "Wattage", value: "55W per bulb" },
      { label: "Lifespan", value: "50,000+ hours" },
      { label: "Warranty", value: "2 Years" },
      { label: "Installation", value: "DIY / Professional" },
    ],
  },
  {
    id: 3,
    name: "Ceramic Pro 9H",
    price: "$450",
    description:
      "Professional grade ceramic coating for ultimate paint protection and high gloss finish.",
    longDescription:
      "Shield your vehicle's paint with the industry-leading Ceramic Pro 9H coating. This professional-grade ceramic layer provides unmatched protection against environmental contaminants, UV rays, and minor scratches while delivering a stunning, showroom-quality shine that lasts for years.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjdT7hfoL0bBCuLu0_24Gaz4Ir9HPVZvWNSc6TaIs5OXLLzXvnkrwNEMH2PtnvYU5uwxuO95VEO-wOqlWH_9or9gMhXyIqphJ_K8BTT9WvNJEzT6c6FwwG-Yzle2k5D818OlVKlDxiigZnswdQdQwyo3lQW_0YaoSIXlRwji_3NHgzeHq0r221BBUVWUKJD4Fy7k12ikenxHjpOROfaNIOYZHvNQImHXut9RWaKw9d08nc2k64rC77L9nDcwMzKH-lnU_nw1nFQ8yl",
    ],
    category: "carcare",
    slug: "ceramic-pro-9h",
    features: [
      "9H hardness rating",
      "5+ years of protection",
      "Hydrophobic water beading",
      "UV and oxidation resistant",
      "Anti-graffiti properties",
      "Self-cleaning effect",
    ],
    specifications: [
      { label: "Hardness", value: "9H (Highest Rating)" },
      { label: "Durability", value: "5+ Years" },
      { label: "Layers", value: "2-4 coats" },
      { label: "Curing Time", value: "24-48 hours" },
      { label: "Warranty", value: "5 Year Certified" },
      { label: "Installation", value: "Professional Only" },
    ],
  },
  {
    id: 4,
    name: "Premium Body Wrap",
    price: "$1,200+",
    description:
      "Premium vinyl wraps in matte, gloss, or satin finishes. Protects original paint.",
    longDescription:
      "Transform your vehicle's appearance with our premium body wraps. Available in a stunning array of colors and finishes including matte, gloss, satin, and specialty textures. Our wraps not only give your car a fresh new look but also protect the original paint from chips, scratches, and UV damage.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
    ],
    badge: "TRENDING",
    badgeColor: "bg-blue-600",
    category: "exterior",
    slug: "premium-body-wrap",
    features: [
      "3M or Avery Dennison vinyl",
      "Full color change capability",
      "Paint protection function",
      "Fully removable, no damage",
      "5-7 year outdoor durability",
      "Custom designs available",
    ],
    specifications: [
      { label: "Material", value: "3M 2080 / Avery SW900" },
      { label: "Finish Options", value: "Matte, Gloss, Satin, Chrome" },
      { label: "Durability", value: "5-7 Years" },
      { label: "Removability", value: "Clean removal" },
      { label: "Warranty", value: "3 Years" },
      { label: "Installation", value: "Professional (3-5 days)" },
    ],
  },
  {
    id: 5,
    name: "Deep Clean Package",
    price: "$85",
    description:
      "Complete interior detailing service with sanitization and upholstery protection.",
    longDescription:
      "Give your car's interior the spa treatment it deserves with our Deep Clean Package. Our certified detailers use professional-grade products to thoroughly clean every surface, eliminate odors, and apply protective treatments that keep your interior looking fresh for months.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_oVI-2UEPOrPZpB27TYqA10_x94-4GfE9rwkHSs_PysDrRiCmv6MhMKtfOe-iHp8bH1CBlNr3JKpqikB9OxLmt4orgRZq-RL64g_9XYTNtYFEV0SkCPSDw7Rd5hvte5I7PlXrr6IOSIBbV0HzJt22TVLdHGYXuDnYdLjsyOZik029nPNYGToyzJ9z1ZVSxWCZXIgDbE3wMExaszFdFVwvLhqNx2n6Si5MwYK7plUz76lirgk55gQFYy64a6zzu8imjLNTFT209kq7",
    ],
    category: "interior",
    slug: "deep-clean-package",
    features: [
      "Full vacuum and extraction",
      "Steam sanitization",
      "Leather conditioning",
      "Fabric protection coating",
      "Air vent deep clean",
      "Odor elimination treatment",
    ],
    specifications: [
      { label: "Duration", value: "3-4 hours" },
      { label: "Products", value: "Professional Grade" },
      { label: "Coverage", value: "Full Interior" },
      { label: "Add-ons", value: "Available" },
      { label: "Booking", value: "Appointment Required" },
      { label: "Location", value: "At our workshop" },
    ],
  },
  {
    id: 6,
    name: "Caliper Painting",
    price: "$150",
    description:
      "Heat-resistant custom caliper painting in any color to match your style.",
    longDescription:
      "Add a pop of color to your wheels with our professional caliper painting service. Using heat-resistant, automotive-grade paint, we transform your brake calipers into eye-catching accents that complement your vehicle's style. Choose from any color to match or contrast with your car's aesthetic.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzshqibUkfnmrePsD-zVSkACmgO2hNkwpndq_7UQ1kt4FyFmkhbThcP0_mNceFX-Nz9VahL8EsW5eJYv1cnSRkqBHBtdYL7_GqozYjb7i6BqJXA73QfbD6Jcb_ONwZ8wdR6rqJBSHRHkJEZftj8_19v7DAeMDmNrxEfg_MjcH5sP_3e0LyWWCk6M7-KpT-J_wSn5NOpm8ULIb3rbIP5q5_nPfwwKmN78j_5S7lT2AEHrEQSTuSYhU1NrdF2t8f2SitGNwvksMKtUNi",
    ],
    category: "exterior",
    slug: "caliper-painting",
    features: [
      "Heat-resistant up to 900°F",
      "Any custom color available",
      "Professional prep & finish",
      "Clear coat protection",
      "Logo/text options available",
      "Same-day service possible",
    ],
    specifications: [
      { label: "Paint Type", value: "High-Temp Ceramic" },
      { label: "Heat Rating", value: "900°F / 480°C" },
      { label: "Colors", value: "Unlimited Options" },
      { label: "Duration", value: "4-6 hours" },
      { label: "Warranty", value: "1 Year" },
      { label: "Prep", value: "Included" },
    ],
  },
  {
    id: 7,
    name: "Leather Upholstery",
    price: "$800+",
    description:
      "Custom hand-stitched leather upholstery restoration for classic and modern vehicles.",
    longDescription:
      "Elevate your vehicle's interior with our bespoke leather upholstery service. Whether you're restoring a classic or upgrading a modern vehicle, our master craftsmen create custom leather interiors using only the finest hides and traditional hand-stitching techniques for a truly luxurious finish.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAnU8s7DRK05vvR4-i9TX8ECgP8QvLGbjgOB7N3JiPM7Tkx9Y0qWbdhVYzI7RFlEYXaitEbWvV6t5seDCaQZuQymlp_XTueVHAX0zt1gsbh0w9rANbLF9t2vEH4IKs8mcAtxyjhcpdh0d7zgZUESohfW-Hb1LoAGL1ozmgQDSq1qLDmMIcXpQTotUmhFbrnO6ZM0e5Xbe3T6HcXmJBefZ11Sjqnyvjd6H2tBo7dtMpfgtsgeUVz-zdnuZcsHBLM5WIqH0KBRt3dqTP",
    ],
    category: "interior",
    slug: "leather-upholstery",
    features: [
      "Genuine Italian leather",
      "Hand-stitched details",
      "Custom color matching",
      "Full seat or partial options",
      "Heated seat compatible",
      "10+ year lifespan",
    ],
    specifications: [
      { label: "Material", value: "Italian Nappa Leather" },
      { label: "Stitching", value: "Hand & Machine" },
      { label: "Coverage", value: "Full / Partial" },
      { label: "Turnaround", value: "5-10 business days" },
      { label: "Warranty", value: "3 Years" },
      { label: "Consultation", value: "Free" },
    ],
  },
  {
    id: 8,
    name: "Engine Detailing",
    price: "$95",
    description:
      "Safe and thorough engine bay cleaning and dressing to make your engine look brand new.",
    longDescription:
      "A clean engine bay not only looks impressive but can also help identify leaks and issues early. Our engine detailing service uses safe, non-conductive degreasers and careful techniques to restore your engine bay to showroom condition without risking damage to sensitive electronics.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCoAbH75labLjI9IYarI3itXkkAQs2tKh0MhYLu3FpC-wPAUchj2nvP-ET-jZ65bmh8lOd-JlmtUF1QqR_qYshro76zifGO7J7Vl_Ynz4QbsMOpKd5_rfx4RVfCnDXCay2G7JqnygWg6MrIWXgS2FLTSxI612OsefrwVsVYVJRTlNrpXT6jXbDtYUJFWm6l0sE855BarVs3DMHwZjImgSv0k_7w3NRqwVz0rbcFXI4i2mHN2h4gYvCuj5e_dk2oSMFO2pQU98546QdZ",
    ],
    category: "carcare",
    slug: "engine-detailing",
    features: [
      "Safe degreasing products",
      "Electronics protection",
      "Plastic & rubber restoration",
      "Hose and wire dressing",
      "Corrosion prevention",
      "Photo documentation",
    ],
    specifications: [
      { label: "Duration", value: "1.5-2 hours" },
      { label: "Products", value: "Non-conductive" },
      { label: "Safe For", value: "All engine types" },
      { label: "Add-ons", value: "Available" },
      { label: "Booking", value: "Walk-in / Appointment" },
      { label: "Location", value: "At our workshop" },
    ],
  },
  {
    id: 9,
    name: "Satin Blue Wrap",
    price: "$1,500",
    description:
      "Limited edition Satin Blue wrap for sports cars. Includes full surface preparation.",
    longDescription:
      "Make a statement with our exclusive Satin Blue wrap. This limited edition color features a stunning satin finish that shifts subtly in different lighting conditions. Perfect for sports cars and enthusiasts who want to stand out from the crowd with a unique, head-turning look.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWugNyDlKtNxyczpj97MSJXcpRGmfPUXaSO1GaOpNhX9bXlZqQkMIa047q_4EB9U9E3ohLZlEu5pZJO7tq_hNjHOsFvFhGPUyoP7aeb_hSDw2NINFl29ikGdseQiCOkg8hGK-T_9-7RAff4V25Lwc_lHSBcscdWMgQUqJJFcm7U2qhaES8RV91flNRLb4pqhy11JGClDzC1D87NMirgpD5c_DPDwHty5d2wzeNqyWsXSHTzblsCeu2wTuWCFt8WAr3DCc0lEsU6L3t",
    ],
    category: "exterior",
    slug: "satin-blue-wrap",
    features: [
      "Exclusive satin finish",
      "Color-shifting effect",
      "Full surface preparation",
      "Edge sealing included",
      "Door jambs included",
      "Premium 3M material",
    ],
    specifications: [
      { label: "Material", value: "3M 2080 Satin Series" },
      { label: "Color", value: "Satin Ocean Blue" },
      { label: "Coverage", value: "Full body" },
      { label: "Durability", value: "5-7 Years" },
      { label: "Warranty", value: "3 Years" },
      { label: "Installation", value: "3-5 days" },
    ],
  },
];

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = products.find((p) => p.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <section className="px-4 md:px-8 lg:px-40 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
          search_off
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          Product Not Found
        </h1>
        <p className="text-slate-400 mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/products"
          className="px-6 py-2 rounded-md bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium transition-colors"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="border-b border-[#1e293b] bg-[#0f172a]/30 pt-8 pb-8">
        <div className="px-4 md:px-8 lg:px-40">
          <nav className="flex items-center text-sm text-slate-500">
            <Link href="/" className="hover:text-[#3b82f6] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <Link
              href="/products"
              className="hover:text-[#3b82f6] transition-colors"
            >
              Products
            </Link>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="px-4 md:px-8 lg:px-40 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-4/3 relative rounded-xl overflow-hidden bg-[#0f172a] border border-[#1e293b]">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <div
                  className={`absolute top-4 right-4 ${product.badgeColor || "bg-[#3b82f6]"} text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg`}
                >
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#3b82f6] ring-2 ring-[#3b82f6]/20"
                        : "border-[#1e293b] hover:border-slate-500"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-[#3b82f6] font-medium uppercase tracking-wide mb-2">
                {product.category.charAt(0).toUpperCase() +
                  product.category.slice(1)}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                {product.name}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#1e293b]">
              <span className="text-4xl font-black text-white">
                {product.price}
              </span>
              {product.price.includes("+") && (
                <span className="text-sm text-slate-500">starting price</span>
              )}
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3b82f6]">
                    verified
                  </span>
                  Key Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-slate-300"
                    >
                      <span className="material-symbols-outlined text-[#25D366] text-[18px] mt-0.5">
                        check_circle
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/30"
              >
                <span className="material-symbols-outlined text-[24px]">
                  chat
                </span>
                Order via WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex-1 h-14 rounded-lg border border-[#1e293b] bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold flex items-center justify-center gap-3 transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">
                  calendar_month
                </span>
                Book Appointment
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-[18px]">
                  local_shipping
                </span>
                Free Installation
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-[18px]">
                  verified_user
                </span>
                Warranty Included
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {product.specifications && (
        <section className="px-4 md:px-8 lg:px-40 pb-16">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#3b82f6]">
                list_alt
              </span>
              Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col p-4 bg-[#020817] rounded-lg border border-[#1e293b]"
                >
                  <span className="text-sm text-slate-500 mb-1">
                    {spec.label}
                  </span>
                  <span className="text-white font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products CTA */}
      <section className="px-4 md:px-8 lg:px-40 pb-16">
        <div className="bg-linear-to-r from-[#3b82f6]/10 to-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Looking for something else?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Browse our full catalog of premium car accessories and services.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold transition-colors"
          >
            View All Products
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
