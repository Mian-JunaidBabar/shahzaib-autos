import Link from "next/link";

const products = [
  {
    id: 1,
    name: "7D Custom Mats",
    sku: "MAT-7D-BMW5",
    image: "/placeholder-product.jpg",
    category: {
      name: "Interior",
      color: "bg-blue-950 text-blue-300 border-blue-900/50",
    },
    price: "$120.00",
    stock: { count: 12, status: "in_stock" },
    enabled: true,
  },
  {
    id: 2,
    name: "LED Headlights Kit - H7",
    sku: "LED-H7-6000K",
    image: null,
    category: {
      name: "Lighting",
      color: "bg-purple-950 text-purple-300 border-purple-900/50",
    },
    price: "$85.50",
    stock: { count: 45, status: "in_stock" },
    enabled: true,
  },
  {
    id: 3,
    name: "Ceramic Coating Spray",
    sku: "CARE-CER-500",
    image: null,
    category: {
      name: "Car Care",
      color: "bg-emerald-950 text-emerald-300 border-emerald-900/50",
    },
    price: "$35.00",
    stock: { count: 3, status: "low_stock" },
    enabled: true,
  },
  {
    id: 4,
    name: "Performance Air Filter",
    sku: "PERF-AF-UNIV",
    image: null,
    category: {
      name: "Performance",
      color: "bg-orange-950 text-orange-300 border-orange-900/50",
    },
    price: "$65.00",
    stock: { count: 0, status: "out_of_stock" },
    enabled: false,
  },
  {
    id: 5,
    name: "Leather Seat Covers",
    sku: "INT-SEAT-BK",
    image: null,
    category: {
      name: "Interior",
      color: "bg-blue-950 text-blue-300 border-blue-900/50",
    },
    price: "$299.00",
    stock: { count: 5, status: "in_stock" },
    enabled: true,
  },
];

const stockColors: Record<string, { dot: string; text: string }> = {
  in_stock: { dot: "bg-success", text: "text-slate-300" },
  low_stock: { dot: "bg-warning animate-pulse", text: "text-warning" },
  out_of_stock: { dot: "bg-slate-600", text: "text-slate-500" },
};

export default function InventoryPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Inventory Management
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-semibold text-slate-300">
              124 Products
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 transition-all shadow-lg shadow-blue-900/20 gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-t-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </span>
            <input
              className="w-full bg-muted/50 border border-border text-slate-100 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-500"
              placeholder="Search products by name, SKU..."
              type="text"
            />
          </div>
          <div className="w-full md:w-48">
            <select className="w-full bg-muted/50 border border-border text-slate-100 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
              <option value="">All Categories</option>
              <option value="interior">Interior Accessories</option>
              <option value="exterior">Exterior Parts</option>
              <option value="lighting">Lighting</option>
              <option value="performance">Performance</option>
              <option value="care">Car Care</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select className="w-full bg-muted/50 border border-border text-slate-100 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
              <option value="">Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-slate-400 hover:text-white hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
            title="Export"
          >
            <span className="material-symbols-outlined text-[20px]">
              download
            </span>
          </button>
          <button
            className="p-2 text-slate-400 hover:text-white hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
            title="View Options"
          >
            <span className="material-symbols-outlined text-[20px]">
              view_column
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-t-0 border-border rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="p-4 w-[50px]">
                  <input
                    className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/20"
                    type="checkbox"
                  />
                </th>
                <th className="p-4 pl-0">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className={`group hover:bg-muted/30 transition-colors ${
                    !product.enabled ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/20"
                      type="checkbox"
                    />
                  </td>
                  <td className="p-4 pl-0">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border flex items-center justify-center">
                        {product.image ? (
                          <img
                            alt={product.name}
                            className="h-full w-full object-cover"
                            src={product.image}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-slate-600">
                            inventory_2
                          </span>
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium group-hover:text-primary transition-colors ${
                            product.enabled
                              ? "text-white"
                              : "text-slate-400 line-through"
                          }`}
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${product.category.color}`}
                    >
                      {product.category.name}
                    </span>
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      product.enabled ? "text-slate-200" : "text-slate-400"
                    }`}
                  >
                    {product.price}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          stockColors[product.stock.status].dot
                        }`}
                      ></span>
                      <span className={stockColors[product.stock.status].text}>
                        {product.stock.status === "low_stock"
                          ? `Low (${product.stock.count})`
                          : product.stock.status === "out_of_stock"
                            ? "0 units"
                            : `${product.stock.count} units`}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                        product.enabled ? "bg-primary" : "bg-slate-700"
                      }`}
                    >
                      <span className="sr-only">Enable</span>
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                          product.enabled ? "translate-x-4" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-white">1</span> to{" "}
            <span className="font-medium text-white">5</span> of{" "}
            <span className="font-medium text-white">124</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-border bg-card text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded border border-border bg-card text-sm text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
