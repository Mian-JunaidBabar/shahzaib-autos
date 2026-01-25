import Link from "next/link";

const orders = [
  {
    id: "#ORD-2024-001",
    date: "Jan 24, 2026",
    time: "10:42 AM",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      initials: "RS",
      gradient: "from-blue-900 to-slate-900",
    },
    amount: "$120.00",
    payment: { status: "Paid", type: "success" },
    orderStatus: { label: "Completed", color: "success", dot: "bg-success" },
  },
  {
    id: "#ORD-2024-002",
    date: "Jan 24, 2026",
    time: "09:15 AM",
    customer: {
      name: "Priya Singh",
      email: "+92 98765 00000",
      initials: "PS",
      gradient: "from-purple-900 to-slate-900",
    },
    amount: "$450.00",
    payment: { status: "Pending", type: "warning" },
    orderStatus: {
      label: "Processing",
      color: "blue",
      dot: "bg-blue-400 animate-pulse",
    },
  },
  {
    id: "#ORD-2024-003",
    date: "Jan 23, 2026",
    time: "04:30 PM",
    customer: {
      name: "John Doe",
      email: "john.d@example.com",
      initials: "JD",
      gradient: "from-gray-700 to-slate-900",
    },
    amount: "$1,200.00",
    payment: { status: "Failed", type: "destructive" },
    orderStatus: { label: "Cancelled", color: "muted", dot: "bg-slate-500" },
  },
  {
    id: "#ORD-2024-004",
    date: "Jan 22, 2026",
    time: "11:00 AM",
    customer: {
      name: "Amit Patel",
      email: "amit.patel@work.com",
      initials: "AP",
      gradient: "from-green-900 to-slate-900",
    },
    amount: "$85.00",
    payment: { status: "Paid", type: "success" },
    orderStatus: { label: "Completed", color: "success", dot: "bg-success" },
  },
  {
    id: "#ORD-2024-005",
    date: "Jan 21, 2026",
    time: "02:20 PM",
    customer: {
      name: "Sarah Lee",
      email: "+92 99887 77665",
      initials: "SL",
      gradient: "from-pink-900 to-slate-900",
    },
    amount: "$210.00",
    payment: { status: "Paid", type: "success" },
    orderStatus: {
      label: "Ready to Ship",
      color: "blue",
      dot: "bg-blue-400 animate-pulse",
    },
  },
];

const paymentColors: Record<string, string> = {
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  destructive: "bg-destructive/10 text-destructive ring-destructive/20",
};

const statusColors: Record<string, string> = {
  success: "bg-muted text-slate-300 ring-border",
  blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  muted: "bg-muted text-muted-foreground ring-border",
};

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Orders List
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-muted border border-border rounded-lg hover:text-white hover:bg-muted/80 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
          <Link
            href="/admin/orders/new"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Order
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground material-symbols-outlined text-[20px]">
              search
            </span>
            <input
              className="w-full bg-card border border-border text-sm text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              placeholder="Search orders..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2.5 bg-card border border-border rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-all text-sm">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <select className="bg-card border border-border text-sm text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[140px]">
            <option value="">Bulk Actions</option>
            <option value="mark_completed">Mark as Completed</option>
            <option value="mark_processing">Mark as Processing</option>
            <option value="cancel">Cancel Orders</option>
          </select>
          <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>
          <select className="bg-card border border-border text-sm text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 w-12">
                  <input
                    className="checkbox-custom cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <input
                      className="checkbox-custom cursor-pointer"
                      type="checkbox"
                    />
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/orders/${order.id.replace("#", "")}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {order.date}{" "}
                    <span className="text-muted-foreground text-xs ml-1">
                      {order.time}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full bg-gradient-to-br ${order.customer.gradient} border border-border flex items-center justify-center text-xs font-bold text-white`}
                      >
                        {order.customer.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">
                          {order.customer.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-white">
                    {order.amount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        paymentColors[order.payment.type]
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        statusColors[order.orderStatus.color]
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${order.orderStatus.dot}`}
                      ></span>
                      {order.orderStatus.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-muted transition-colors">
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

        {/* Pagination */}
        <div className="border-t border-border bg-muted/20 px-4 py-3 flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Showing <span className="font-medium text-white">1</span> to{" "}
                <span className="font-medium text-white">5</span> of{" "}
                <span className="font-medium text-white">42</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-border hover:bg-muted">
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_left
                  </span>
                </button>
                <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-border hover:bg-muted">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-border hover:bg-muted">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-400 ring-1 ring-inset ring-border">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-border hover:bg-muted">
                  8
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-border hover:bg-muted">
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
