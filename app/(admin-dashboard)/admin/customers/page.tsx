import Link from "next/link";

const customers = [
  {
    id: 1,
    name: "Ahmed Khan",
    initials: "AK",
    email: "ahmed.khan@email.com",
    phone: "+92 300 1234567",
    ordersCount: 8,
    totalSpent: "$1,245.00",
    lastOrder: "Dec 15, 2024",
    status: {
      name: "Active",
      color: "bg-success/10 text-success border-success/20",
      dotColor: "bg-success",
    },
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    id: 2,
    name: "Fatima Ali",
    initials: "FA",
    email: "fatima.ali@email.com",
    phone: "+92 312 9876543",
    ordersCount: 3,
    totalSpent: "$560.00",
    lastOrder: "Dec 12, 2024",
    status: {
      name: "Active",
      color: "bg-success/10 text-success border-success/20",
      dotColor: "bg-success",
    },
    gradient: "from-pink-600 to-rose-700",
  },
  {
    id: 3,
    name: "Muhammad Bilal",
    initials: "MB",
    email: "m.bilal@email.com",
    phone: "+92 321 5551234",
    ordersCount: 12,
    totalSpent: "$2,890.00",
    lastOrder: "Dec 10, 2024",
    status: {
      name: "VIP",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      dotColor: "bg-purple-400",
    },
    gradient: "from-purple-600 to-violet-700",
  },
  {
    id: 4,
    name: "Sara Hassan",
    initials: "SH",
    email: "sara.h@email.com",
    phone: "+92 333 4445566",
    ordersCount: 1,
    totalSpent: "$85.00",
    lastOrder: "Dec 08, 2024",
    status: {
      name: "New",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      dotColor: "bg-blue-400",
    },
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: 5,
    name: "Usman Raza",
    initials: "UR",
    email: "usman.raza@email.com",
    phone: "+92 345 6667788",
    ordersCount: 5,
    totalSpent: "$720.00",
    lastOrder: "Nov 28, 2024",
    status: {
      name: "Inactive",
      color: "bg-slate-700/50 text-slate-400 border-border",
      dotColor: "bg-slate-500",
    },
    gradient: "from-orange-600 to-amber-700",
  },
];

export default function CustomersPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Customers
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-slate-400">
              156 Total
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20">
            <span className="material-symbols-outlined text-[20px]">
              person_add
            </span>
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-2 rounded-xl border border-border mb-6">
        <div className="relative w-full sm:max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">
            search
          </span>
          <input
            className="w-full bg-muted/50 border-none text-sm text-slate-200 placeholder:text-slate-500 rounded-lg py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:bg-background transition-colors"
            placeholder="Search by name, email or phone..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-muted/50 border border-border text-slate-100 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
            <option value="new">New</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-slate-400 font-medium text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">
                  <input
                    className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/20"
                    type="checkbox"
                  />
                </th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <input
                      className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/20"
                      type="checkbox"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full bg-gradient-to-br ${customer.gradient} flex items-center justify-center text-xs font-bold text-white shadow-inner`}
                      >
                        {customer.initials}
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium group-hover:text-primary transition-colors">
                          {customer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Last order: {customer.lastOrder}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-300 text-sm">
                        {customer.email}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {customer.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-200">
                      {customer.ordersCount}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">orders</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {customer.totalSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${customer.status.color} text-xs font-medium border`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${customer.status.dotColor}`}
                      ></span>
                      {customer.status.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-muted transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </Link>
                      <button
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-muted transition-colors"
                        title="Edit Customer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        className="p-1.5 rounded text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Customer"
                      >
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
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
          <div className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-300">1-5</span> of{" "}
            <span className="font-medium text-slate-300">156</span> customers
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-muted text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button className="h-7 w-7 rounded bg-primary text-white text-xs font-medium flex items-center justify-center">
              1
            </button>
            <button className="h-7 w-7 rounded hover:bg-muted text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center">
              2
            </button>
            <button className="h-7 w-7 rounded hover:bg-muted text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center">
              3
            </button>
            <span className="text-slate-500 px-1">...</span>
            <button className="h-7 w-7 rounded hover:bg-muted text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center">
              32
            </button>
            <button className="p-1.5 rounded hover:bg-muted text-slate-400 hover:text-white">
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
