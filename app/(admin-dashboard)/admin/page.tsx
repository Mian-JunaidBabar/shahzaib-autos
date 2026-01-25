import Link from "next/link";

// Stats cards data
const stats = [
  {
    label: "Total Orders",
    value: "1,248",
    change: "+12%",
    changeType: "positive",
    icon: "shopping_bag",
  },
  {
    label: "Pending",
    value: "42",
    change: "+4 new",
    changeType: "warning",
    icon: "pending_actions",
  },
  {
    label: "Completed",
    value: "1,180",
    change: "+8%",
    changeType: "positive",
    icon: "task_alt",
  },
  {
    label: "Conversion Rate",
    value: "24.8%",
    change: "from WhatsApp",
    changeType: "neutral",
    icon: "trending_up",
  },
];

// Recent orders data
const recentOrders = [
  {
    id: "#ORD-7829",
    customer: { name: "John Doe", initials: "JD" },
    phone: "+92 (321) 123-4567",
    product: "7D Custom Mats (BMW)",
    status: { label: "New", color: "blue" },
    date: "Jan 24, 2026",
  },
  {
    id: "#ORD-7828",
    customer: { name: "Sarah Connor", initials: "SC" },
    phone: "+92 (300) 987-6543",
    product: "Ceramic Pro 9H",
    status: { label: "Contacted", color: "yellow" },
    date: "Jan 24, 2026",
  },
  {
    id: "#ORD-7827",
    customer: { name: "Mike Ross", initials: "MR" },
    phone: "+92 (333) 246-8101",
    product: "Full Body Wrap (Matte)",
    status: { label: "Completed", color: "green" },
    date: "Jan 23, 2026",
  },
  {
    id: "#ORD-7826",
    customer: { name: "Alex Lee", initials: "AL" },
    phone: "+92 (312) 777-9999",
    product: "LED Projector Kit",
    status: { label: "Contacted", color: "yellow" },
    date: "Jan 23, 2026",
  },
  {
    id: "#ORD-7825",
    customer: { name: "David Chen", initials: "DC" },
    phone: "+92 (345) 333-2222",
    product: "Caliper Painting (Red)",
    status: { label: "New", color: "blue" },
    date: "Jan 22, 2026",
  },
];

const statusColors: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
};

const statusDotColors: Record<string, string> = {
  blue: "bg-blue-400",
  yellow: "bg-yellow-400",
  green: "bg-green-400",
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <span className="material-symbols-outlined text-muted-foreground text-[20px]">
                {stat.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>
              <span
                className={`text-xs font-medium flex items-center ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "warning"
                      ? "text-warning"
                      : "text-slate-500"
                }`}
              >
                {stat.change}
                {stat.changeType === "positive" && (
                  <span className="material-symbols-outlined text-[12px]">
                    arrow_upward
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <p className="text-sm text-slate-400">
              Manage incoming WhatsApp leads and orders.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-500">
                filter_list
              </span>
              <select className="h-9 rounded-md border border-border bg-muted/50 pl-9 pr-8 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer w-full sm:w-[150px]">
                <option>All Statuses</option>
                <option>New Lead</option>
                <option>Contacted</option>
                <option>Completed</option>
              </select>
            </div>
            <Link
              href="/admin/orders/new"
              className="h-9 px-4 rounded-md bg-white text-background text-sm font-medium hover:bg-slate-200 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Order
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Phone / WhatsApp</th>
                <th className="px-6 py-3 font-medium">Product Interest</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-card hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {order.customer.initials}
                      </div>
                      <span className="text-slate-200 font-medium">
                        {order.customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-mono">
                        {order.phone}
                      </span>
                      <a
                        className="h-6 w-6 rounded bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all"
                        href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          chat
                        </span>
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{order.product}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        statusColors[order.status.color]
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusDotColors[order.status.color]
                        }`}
                      ></span>
                      {order.status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Showing 1-5 of 42 orders
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border border-border bg-card text-sm text-slate-400 hover:text-white hover:bg-muted transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <Link
              href="/admin/orders"
              className="px-3 py-1 rounded border border-border bg-card text-sm text-white hover:bg-muted transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
