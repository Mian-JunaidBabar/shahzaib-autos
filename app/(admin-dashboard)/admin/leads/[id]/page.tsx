import Link from "next/link";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin/leads"
            >
              Leads
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span>#LEA-{id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Lead Details
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
              New Inquiry
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Lead Age:{" "}
            <span className="text-slate-300 font-medium">2 hours</span>
          </span>
          <div className="h-4 w-px bg-border"></div>
          <span className="text-xs text-muted-foreground">
            Source:{" "}
            <span className="text-[#25D366] font-medium inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                chat
              </span>{" "}
              WhatsApp
            </span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Customer Information */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                Customer Information
              </h3>
              <button className="text-xs text-primary hover:underline">
                Edit Details
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-border flex items-center justify-center text-2xl font-bold text-slate-300 shadow-inner">
                  RS
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Full Name
                    </p>
                    <p className="text-slate-100 font-medium text-lg">
                      Rahul Sharma
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Phone Number
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-100 font-medium text-lg">
                        +91 98765 43210
                      </p>
                      <a
                        className="text-[#25D366] hover:bg-[#25D366]/10 p-1 rounded transition-colors"
                        href="#"
                        title="Chat on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chat
                        </span>
                      </a>
                      <a
                        className="text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                        href="#"
                        title="Call"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          call
                        </span>
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-slate-100">Mumbai, Maharashtra</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Vehicle Model
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded text-sm text-slate-300 mt-1">
                      <span className="material-symbols-outlined text-[14px]">
                        directions_car
                      </span>
                      BMW 5 Series (2022)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Timeline */}
          <div className="rounded-xl border border-border bg-card shadow-sm flex-1">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
                Interaction Timeline
              </h3>
            </div>
            <div className="p-6 relative">
              <div className="absolute left-9 top-6 bottom-6 w-px bg-border"></div>
              <div className="space-y-8 relative">
                {/* Incoming Inquiry */}
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-[#25D366]/20 border border-[#25D366] flex items-center justify-center shrink-0 z-10 mt-1">
                    <span className="material-symbols-outlined text-[12px] text-[#25D366]">
                      chat
                    </span>
                  </div>
                  <div className="flex-1 bg-muted/40 rounded-lg p-4 border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-white">
                        Incoming Inquiry
                      </span>
                      <span className="text-xs text-slate-500">
                        Today, 10:42 AM
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      &quot;Hi, I&apos;m interested in the 7D Custom Mats for my
                      BMW. Is it available in black with red stitching? Also
                      what is the delivery time to Mumbai?&quot;
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-background border border-border px-2 py-1 rounded text-slate-400">
                        <span className="material-symbols-outlined text-[12px]">
                          image
                        </span>{" "}
                        Product Image Ref
                      </span>
                    </div>
                  </div>
                </div>

                {/* Automated Reply */}
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center shrink-0 z-10 mt-1">
                    <span className="material-symbols-outlined text-[12px] text-primary">
                      smart_toy
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-300">
                        Automated Reply Sent
                      </span>
                      <span className="text-xs text-slate-500">
                        Today, 10:42 AM
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Thank you for contacting Shahzaib Autos. An agent will
                      review your request shortly.
                    </p>
                  </div>
                </div>

                {/* Add Note */}
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shrink-0 z-10 mt-1">
                    <span className="material-symbols-outlined text-[12px] text-slate-500">
                      add
                    </span>
                  </div>
                  <div className="flex-1">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        edit_note
                      </span>
                      Add Internal Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Product Inquired */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/50 p-4 border-b border-border">
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wide">
                Product Inquired
              </h3>
            </div>
            <div className="p-0">
              <div className="relative aspect-video w-full bg-muted">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600 text-[48px]">
                    directions_car
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                  SKU: MAT-7D-BMW5
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white text-lg mb-1">
                  7D Custom Mats
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Luxury Series - Black / Red Stitching
                </p>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Unit Price</p>
                    <p className="text-xl font-bold text-white">$120.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-0.5">
                      Stock Status
                    </p>
                    <div className="flex items-center justify-end gap-1.5 text-success font-medium text-sm">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                      In Stock (12)
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-blue-400 text-[18px] mt-0.5">
                    inventory_2
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-200">
                      Recommendation
                    </p>
                    <p className="text-xs text-blue-300/80 mt-0.5">
                      Upsell opportunity: Suggest trunk mat addition for bundle
                      discount.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Actions */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Workflow Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full group relative flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 transition-all shadow-lg shadow-blue-900/20">
                <span className="material-symbols-outlined text-[20px]">
                  check_circle
                </span>
                Mark as Contacted
              </button>
              <button className="w-full group relative flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-2.5 px-4 transition-all shadow-lg shadow-green-900/20">
                <span className="material-symbols-outlined text-[20px]">
                  shopping_cart_checkout
                </span>
                Create Order
              </button>
              <div className="h-px bg-border my-2"></div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted text-slate-300 hover:text-white text-sm font-medium py-2 px-3 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    snooze
                  </span>
                  Snooze
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-destructive/10 hover:border-destructive/50 text-slate-300 hover:text-destructive text-sm font-medium py-2 px-3 transition-all">
                  <span className="material-symbols-outlined text-[18px]">
                    archive
                  </span>
                  Archive
                </button>
              </div>
            </div>
          </div>

          {/* Lead Quality */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-muted p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded bg-background border border-border">
                <span className="material-symbols-outlined text-yellow-500">
                  star
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lead Quality</p>
                <p className="font-bold text-white">High Priority</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Based on product value & previous purchase history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
