import Link from "next/link";
import { OptimizedImage } from "@/components/optimized-image";

const products = [
  {
    title: "Ultra LED Headlights",
    desc: "Universal 6000K Pure White",
    price: "$299.00",
    rating: "4.8",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAa3IMOLTknRCq5olzyIV6zBhxwanUbdL_3aD0tj0R_STMlSnXO91qpbRrek-43XeJaSWaydQQ6E_kXGvmzBvFxu9gaoIs_yO_EIgHi9IrRKgW6irxAB49wjmGCVf3VIS3cXF1MMJZVl4B0lnBsQomDZ0bDCrNR25LbqZAriEBNV64S9GyIsd7CFhLcBk7J4w5zomA0TrTIRRpK90AYjSwxQih-JAWpRnjnoYl4DRF1cV-JNUBL4mm7PgKCTnBReJL1KWwvobgtqmvw",
  },
  {
    title: "Carbon Fiber Tips",
    desc: "Matte Finish Sport Edition",
    price: "$145.00",
    rating: "4.9",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zX4s0E7oFWrKAjT5yphjrjTYrlIaPPF83Y_zkIoc6Gy2mwtU0f53nthMxRmrZNgqeIP-8jma9gkEREp8d8J3OCtcaRoA4T4cI6QUGsTvDf8cHPXMp3PlX_niSP3N2FQdAWCjQd6GoFNyge1Brb1RJ7mo2JvVenwzwVKpLu7tzGPB0-eIoJ7Nm0dsnwlBt-UX1zzpZ042uUHY462umYWIVpomuiA3uA-QGBVYpeggq0dfXKCyrCCHjj8MyvOhpCNj_HzBzURc3a3O",
  },
  {
    title: "4K Dash Camera",
    desc: "Night Vision + GPS Tracking",
    price: "$189.00",
    rating: "4.7",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNjlk6R_-NvtjVmKBAv6YVYagbpDuI_xxbWsWY3kGUHsNUZWx7NKOoUQ31mk-_sPd2R_BCpSVer2mTR04WfdlWhXHtYI_zGCQhMF5F7FiTiaqRs1qj4OAEBBOORMDpR5iZbPkwyPePTOVDcuRuq2zoXfRM8tURZMnCvSgDTYiquN6Lx55uC0zuFXP1vvDqUV3xHsPmvhXawLrFvEiupTk3PM3szzrOXL-aNlHP41mslqgNfKYkNNUN8chdhHhhgpPw9cGiTKJ-W0K8",
  },
  {
    title: "High-Flow Air Filter",
    desc: "Performance Boost Filter",
    price: "$85.00",
    rating: "5.0",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCN_-LEwAQFt6Nn2sVo7cjE3bA2UNfP-WQz5QB3iZlGcTvptw-weX35wmLQK6f8RXLu4QTnPXmhrs7ge4YbrYFRfH20w_4Cg9ouiT38uZXsxdOwC6cLmQB6BjfV-m95j0-zKy_wUFtUDlOvN8VOyafAhgKc6h9ApujxZOhBevcQmbO_mS6wVQdxBXw5YXlVt0PkTlHATl6V-W039IhFJQ3cICgg6uDVRi3BOuf8OGAklYu-6QI-9BrDA2hxNFaufYGHx-nLQAsbDiC0",
  },
];

export function NewArrivals() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            New Arrivals
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            The latest innovations for your vehicle
          </p>
        </div>
        <Link
          href="/products"
          className="text-primary font-bold flex items-center gap-1 hover:underline"
        >
          View All{" "}
          <span className="material-symbols-outlined">chevron_right</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 overflow-hidden relative"
          >
            <span className="absolute top-6 left-6 z-10 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
              NEW
            </span>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50 dark:bg-slate-900">
              <OptimizedImage
                alt={product.title}
                src={product.image}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <button className="absolute bottom-4 left-4 right-4 bg-primary text-white py-2 rounded-lg font-bold text-sm translate-y-12 group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  add_shopping_cart
                </span>{" "}
                Add to Cart
              </button>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">
              {product.title}
            </h4>
            <p className="text-xs text-slate-500 mb-2">{product.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-primary font-black text-lg">
                {product.price}
              </span>
              <div className="flex text-yellow-400">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-slate-400 text-xs ml-1 font-bold">
                  {product.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
