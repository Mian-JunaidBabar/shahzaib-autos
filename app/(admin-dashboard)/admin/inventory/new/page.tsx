"use client";

import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin/inventory"
            >
              Inventory
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="text-white">Add Product</span>
          </nav>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Add New Product
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inventory"
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-muted border border-border rounded-lg hover:bg-card hover:text-white transition-all"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Product
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                General Information
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Product Name
                </label>
                <input
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500 transition-all"
                  placeholder="e.g. 7D Custom Floor Mats - Luxury Series"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <div className="border border-border rounded-lg overflow-hidden bg-muted/30 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                  <div className="bg-muted/50 border-b border-border p-2 flex gap-1">
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Bold"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_bold
                      </span>
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Italic"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_italic
                      </span>
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Underline"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_underlined
                      </span>
                    </button>
                    <div className="w-px h-6 bg-border mx-1 self-center"></div>
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Bullet List"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_list_bulleted
                      </span>
                    </button>
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Numbered List"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_list_numbered
                      </span>
                    </button>
                    <div className="w-px h-6 bg-border mx-1 self-center"></div>
                    <button
                      className="p-1.5 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Insert Link"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        link
                      </span>
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-transparent border-none p-4 text-white focus:ring-0 h-40 resize-none placeholder-slate-500"
                    placeholder="Describe the product features, materials, and compatibility..."
                  ></textarea>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 text-right">
                  0 / 2000 characters
                </p>
              </div>
            </div>
          </div>

          {/* Product Media */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  imagesmode
                </span>
                Product Media
              </h3>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all bg-muted/10 cursor-pointer group relative">
                <input
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                  type="file"
                />
                <div className="h-14 w-14 rounded-full bg-muted border border-border flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary/50 group-hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[28px]">
                    cloud_upload
                  </span>
                </div>
                <p className="text-sm font-medium text-white mb-1">
                  Click to upload image or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  SVG, PNG, JPG or GIF (max. 2MB)
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="relative aspect-square bg-muted rounded-lg border border-border flex items-center justify-center overflow-hidden group">
                  <span className="material-symbols-outlined text-slate-600">
                    image
                  </span>
                  <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center gap-2 transition-all">
                    <button className="p-1.5 bg-destructive rounded text-white hover:bg-red-600 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
                <div className="relative aspect-square bg-muted/30 rounded-lg border border-border border-dashed flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Organization */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-muted-foreground">
                Organization
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <select className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer">
                  <option disabled value="">
                    Select category
                  </option>
                  <option value="interior">Interior Accessories</option>
                  <option value="exterior">Exterior Parts</option>
                  <option value="performance">Performance</option>
                  <option value="care">Car Care</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Status
                </label>
                <select className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-muted-foreground">
                Pricing
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Base Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">
                    $
                  </span>
                  <input
                    className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Discount Price{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">
                    $
                  </span>
                  <input
                    className="w-full bg-muted/50 border border-border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-muted-foreground">
                Inventory
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Stock Quantity
                </label>
                <input
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500"
                  placeholder="0"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  SKU{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Stock Keeping Unit)
                  </span>
                </label>
                <input
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500 uppercase font-mono text-sm"
                  placeholder="PROD-XXX"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
