import Link from "next/link";

const bookings = [
  {
    id: "#BK-9021",
    customer: {
      name: "John Doe",
      phone: "+92 98765 00001",
      initials: "JD",
      gradient: "from-indigo-500 to-purple-600",
    },
    service: {
      name: "Ceramic Coating",
      icon: "format_paint",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    vehicle: "BMW 5 Series",
    date: "Jan 24, 2026",
    time: "10:00 AM - 02:00 PM",
    status: { label: "Confirmed", color: "blue" },
  },
  {
    id: "#BK-9022",
    customer: {
      name: "Amit Singh",
      phone: "+92 99887 77665",
      initials: "AS",
      gradient: "from-orange-500 to-red-600",
    },
    service: {
      name: "PPF Installation",
      icon: "layers",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    vehicle: "Toyota Fortuner",
    date: "Jan 25, 2026",
    time: "09:30 AM - 06:00 PM",
    status: { label: "Rescheduled", color: "yellow" },
  },
  {
    id: "#BK-9018",
    customer: {
      name: "Meera Kapoor",
      phone: "+92 88776 66554",
      initials: "MK",
      gradient: "from-green-500 to-emerald-600",
    },
    service: {
      name: "Full Detailing",
      icon: "cleaning_services",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    vehicle: "Audi A4",
    date: "Jan 23, 2026",
    time: "02:00 PM - 05:00 PM",
    status: { label: "Done", color: "green" },
  },
  {
    id: "#BK-9025",
    customer: {
      name: "Ravi Kumar",
      phone: "+92 77665 54433",
      initials: "RK",
      gradient: "from-slate-600 to-slate-800",
    },
    service: {
      name: "Interior Detailing",
      icon: "car_repair",
      iconBg: "bg-teal-500/10 text-teal-400",
    },
    vehicle: "Mercedes C-Class",
    date: "Jan 26, 2026",
    time: "11:00 AM - 03:00 PM",
    status: { label: "Confirmed", color: "blue" },
  },
  {
    id: "#BK-9026",
    customer: {
      name: "Priya Sharma",
      phone: "+92 66554 43322",
      initials: "PS",
      gradient: "from-pink-500 to-rose-600",
    },
    service: {
      name: "Paint Correction",
      icon: "brush",
      iconBg: "bg-rose-500/10 text-rose-400",
    },
    vehicle: "Honda City",
    date: "Jan 27, 2026",
    time: "10:00 AM - 04:00 PM",
    status: { label: "Cancelled", color: "red" },
  },
];

const statusColors: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  yellow: "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20",
  green: "bg-green-500/10 text-green-400 ring-green-500/20",
  red: "bg-red-500/10 text-red-400 ring-red-500/20",
};

export default function BookingsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Service Bookings
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
              12 Active
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings/new"
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Booking
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              search
            </span>
            <input
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search by customer, ID or service..."
              type="text"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select className="appearance-none bg-card border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]">
                <option>All Statuses</option>
                <option>Confirmed</option>
                <option>Rescheduled</option>
                <option>Done</option>
                <option>Cancelled</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
            <div className="relative">
              <select className="appearance-none bg-card border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]">
                <option>All Services</option>
                <option>Ceramic Coating</option>
                <option>PPF Install</option>
                <option>Detailing</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 flex items-center justify-end gap-2">
          <div className="flex bg-card rounded-lg border border-border p-1">
            <button className="px-3 py-1.5 text-xs font-medium rounded text-white bg-primary shadow-sm">
              Today
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5">
              Week
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded text-slate-400 hover:text-white hover:bg-white/5">
              Month
            </button>
          </div>
          <div className="relative">
            <input
              className="bg-card border border-border rounded-lg pl-3 pr-2 py-2 text-sm text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer hover:bg-muted transition-colors"
              type="date"
              defaultValue="2026-01-24"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">
                  Booking ID
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">
                  Customer
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">
                  Service Type
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-white group">
                    Date & Time
                    <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_downward
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-slate-400 uppercase tracking-wider text-xs text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-300">
                      {booking.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full bg-gradient-to-br ${booking.customer.gradient} flex items-center justify-center text-xs font-bold text-white`}
                      >
                        {booking.customer.initials}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {booking.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.customer.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded ${booking.service.iconBg}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {booking.service.icon}
                        </span>
                      </div>
                      <span className="text-slate-200">
                        {booking.service.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-9">
                      {booking.vehicle}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200">{booking.date}</span>
                      <span className="text-xs text-muted-foreground">
                        {booking.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        statusColors[booking.status.color]
                      }`}
                    >
                      {booking.status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
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
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-white">1</span> to{" "}
            <span className="font-medium text-white">5</span> of{" "}
            <span className="font-medium text-white">12</span> results
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
