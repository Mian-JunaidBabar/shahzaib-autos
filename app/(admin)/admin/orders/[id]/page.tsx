import Link from "next/link";

const orderItems = [
  {
    id: 1,
    name: "7D Custom Mats - BMW 5 Series",
    sku: "MAT-7D-BMW5",
    variant: "Black / Red Stitching",
    image: "/placeholder-product.jpg",
    price: "$120.00",
    qty: 1,
    total: "$120.00",
  },
  {
    id: 2,
    name: "Express Shipping",
    sku: null,
    variant: "Carrier: FedEx Priority",
    image: null,
    price: "$15.00",
    qty: 1,
    total: "$15.00",
  },
];

const timeline = [
  {
    id: 1,
    title: "Order Confirmed",
    description: "Order #ORD-2024-892 was placed by the customer.",
    time: "Oct 24, 10:45 AM",
    icon: "check",
    iconBg: "bg-blue-500/20 border-blue-500",
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    title: "Payment Verified",
    description: "Payment of $159.30 captured via Stripe.",
    time: "Oct 24, 10:46 AM",
    icon: "credit_card",
    iconBg: "bg-success/20 border-success",
    iconColor: "text-success",
  },
  {
    id: 3,
    title: "Staff Note",
    description:
      "Customer requested to check if red stitching matches the '22 M-Sport interior. Confirmed via WhatsApp images.",
    time: "Oct 24, 11:30 AM",
    icon: "edit_note",
    iconBg: "bg-card border-border",
    iconColor: "text-slate-500",
    isNote: true,
    author: "Admin",
  },
];

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin/orders"
            >
              Orders
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span>#ORD-{id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Order #ORD-{id}
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
              Processing
            </span>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success ring-1 ring-inset ring-success/20">
              Paid
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Date:{" "}
            <span className="text-slate-300 font-medium">
              Oct 24, 2023 at 10:42 AM
            </span>
          </span>
          <div className="h-4 w-px bg-border"></div>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            Next Order{" "}
            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Order Items */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  shopping_bag
                </span>
                Order Items
              </h3>
              <span className="text-xs text-muted-foreground">2 items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium text-right">Price</th>
                    <th className="p-4 font-medium text-center">Qty</th>
                    <th className="p-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded bg-muted overflow-hidden flex-shrink-0 border border-border flex items-center justify-center">
                            {item.image ? (
                              <img
                                alt={item.name}
                                className="w-full h-full object-cover"
                                src={item.image}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-slate-500">
                                inventory_2
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">
                              {item.name}
                            </p>
                            {item.sku && (
                              <p className="text-xs text-muted-foreground">
                                SKU: {item.sku}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.variant}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-slate-300">
                        {item.price}
                      </td>
                      <td className="p-4 text-center text-slate-300">
                        {item.qty}
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-muted/10 border-t border-border flex flex-col md:flex-row justify-end">
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-slate-200">$135.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span className="text-slate-200">$24.30</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">$159.30</span>
                </div>
                <p className="text-xs text-right text-success mt-1">
                  Paid on Oct 24, 2023
                </p>
              </div>
            </div>
          </div>

          {/* Order Activity & Notes */}
          <div className="rounded-xl border border-border bg-card shadow-sm flex-1">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  history_edu
                </span>
                Order Activity & Notes
              </h3>
            </div>
            <div className="p-6 relative">
              <div className="absolute left-9 top-6 bottom-6 w-px bg-border"></div>
              <div className="space-y-8 relative">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div
                      className={`h-6 w-6 rounded-full ${event.iconBg} border flex items-center justify-center shrink-0 z-10 mt-1`}
                    >
                      <span
                        className={`material-symbols-outlined text-[12px] ${event.iconColor}`}
                      >
                        {event.icon}
                      </span>
                    </div>
                    <div
                      className={`flex-1 ${event.isNote ? "bg-muted/30 p-3 rounded-lg border border-border/50" : ""}`}
                    >
                      <div
                        className={`flex justify-between ${event.isNote ? "items-start mb-2" : "items-center mb-1"}`}
                      >
                        <span
                          className={`text-sm ${event.isNote ? "font-semibold text-slate-200" : "font-medium text-slate-300"}`}
                        >
                          {event.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          {event.time}
                        </span>
                      </div>
                      <p
                        className={`text-${event.isNote ? "sm text-slate-400" : "xs text-muted-foreground"}`}
                      >
                        {event.description}
                      </p>
                      {event.isNote && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                            AD
                          </div>
                          <span className="text-xs text-slate-500">
                            {event.author}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-card border border-border flex items-center justify-center shrink-0 z-10 mt-1">
                    <span className="material-symbols-outlined text-[12px] text-slate-500">
                      add
                    </span>
                  </div>
                  <div className="flex-1">
                    <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-2">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Workflow Actions */}
          <div className="rounded-xl border border-border bg-card shadow-sm p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Workflow Actions
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Order Status
                </label>
                <div className="relative">
                  <select className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-3 text-sm text-white focus:ring-primary focus:border-primary appearance-none cursor-pointer">
                    <option>Processing</option>
                    <option>Ready to Ship</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="h-px bg-border"></div>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-white text-slate-900 hover:bg-slate-100 font-medium py-2.5 px-3 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    print
                  </span>
                  Print Invoice
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 hover:bg-muted text-slate-300 hover:text-white text-sm font-medium py-2.5 px-3 transition-all">
                  <span className="material-symbols-outlined text-[20px]">
                    mail
                  </span>
                  Resend Email
                </button>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                Customer Details
              </h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-border flex items-center justify-center text-lg font-bold text-slate-300">
                  RS
                </div>
                <div>
                  <p className="text-slate-100 font-semibold">Rahul Sharma</p>
                  <p className="text-xs text-muted-foreground">
                    Customer since 2022
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-500 text-[18px] mt-0.5">
                    mail
                  </span>
                  <a
                    className="text-sm text-primary hover:underline truncate"
                    href="mailto:rahul.sharma@example.com"
                  >
                    rahul.sharma@example.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-slate-500 text-[18px] mt-0.5">
                    call
                  </span>
                  <div className="text-sm text-slate-300">
                    +91 98765 43210
                    <div className="flex gap-2 mt-1">
                      <a
                        className="text-[10px] bg-[#25D366]/10 text-[#25D366] px-1.5 py-0.5 rounded border border-[#25D366]/20 hover:bg-[#25D366]/20 transition"
                        href="#"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-border"></div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Shipping Address
                </p>
                <div className="text-sm text-slate-300 leading-relaxed">
                  <p>Rahul Sharma</p>
                  <p>Flat 402, Sunshine Heights</p>
                  <p>Andheri West, Mumbai</p>
                  <p>Maharashtra, 400053</p>
                  <p>India</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Billing Address
                </p>
                <div className="text-sm text-slate-400 leading-relaxed">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      check
                    </span>{" "}
                    Same as shipping
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
