import Link from "next/link";

const leads = [
  {
    id: "2024-892",
    name: "Rahul Sharma",
    initials: "RS",
    phone: "+91 98765 43210",
    product: "7D Custom Mats - BMW 5 Series",
    source: "WhatsApp",
    sourceIcon: "chat",
    sourceColor: "text-[#25D366]",
    status: {
      name: "New",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    quality: { name: "High", color: "text-warning" },
    createdAt: "2 hours ago",
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    id: "2024-891",
    name: "Priya Patel",
    initials: "PP",
    phone: "+91 87654 32109",
    product: "LED Headlights Kit - H7",
    source: "Website",
    sourceIcon: "language",
    sourceColor: "text-primary",
    status: {
      name: "Contacted",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    quality: { name: "Medium", color: "text-slate-400" },
    createdAt: "5 hours ago",
    gradient: "from-pink-600 to-rose-700",
  },
  {
    id: "2024-890",
    name: "Amit Singh",
    initials: "AS",
    phone: "+91 76543 21098",
    product: "Ceramic Coating Spray",
    source: "Instagram",
    sourceIcon: "photo_camera",
    sourceColor: "text-purple-400",
    status: {
      name: "Qualified",
      color: "bg-success/10 text-success border-success/20",
    },
    quality: { name: "High", color: "text-warning" },
    createdAt: "1 day ago",
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "2024-889",
    name: "Neha Gupta",
    initials: "NG",
    phone: "+91 65432 10987",
    product: "Performance Air Filter",
    source: "WhatsApp",
    sourceIcon: "chat",
    sourceColor: "text-[#25D366]",
    status: {
      name: "Proposal Sent",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    quality: { name: "High", color: "text-warning" },
    createdAt: "2 days ago",
    gradient: "from-orange-600 to-amber-700",
  },
  {
    id: "2024-888",
    name: "Vikram Kumar",
    initials: "VK",
    phone: "+91 54321 09876",
    product: "Leather Seat Covers",
    source: "Phone",
    sourceIcon: "call",
    sourceColor: "text-slate-400",
    status: {
      name: "Lost",
      color: "bg-slate-700/50 text-slate-400 border-border",
    },
    quality: { name: "Low", color: "text-slate-500" },
    createdAt: "3 days ago",
    gradient: "from-slate-600 to-slate-700",
  },
];

export default function LeadsPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Leads
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-slate-400">
              48 Active
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
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[20px]">
                fiber_new
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-muted-foreground">New Today</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <span className="material-symbols-outlined text-[20px]">
                phone_in_talk
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <span className="material-symbols-outlined text-[20px]">
                verified
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">15</p>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <span className="material-symbols-outlined text-[20px]">
                trending_up
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">32%</p>
              <p className="text-xs text-muted-foreground">Conversion</p>
            </div>
          </div>
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
            placeholder="Search leads..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-muted/50 border border-border text-slate-100 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal Sent</option>
            <option value="lost">Lost</option>
          </select>
          <select className="bg-muted/50 border border-border text-slate-100 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
            <option value="">All Sources</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="phone">Phone</option>
          </select>
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
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Product Interest</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Quality</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
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
                        className={`h-9 w-9 rounded-full bg-gradient-to-br ${lead.gradient} flex items-center justify-center text-xs font-bold text-white shadow-inner`}
                      >
                        {lead.initials}
                      </div>
                      <div>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-slate-200 font-medium group-hover:text-primary transition-colors"
                        >
                          {lead.name}
                        </Link>
                        <p className="text-xs text-slate-500">{lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-sm truncate max-w-[200px]">
                      {lead.product}
                    </p>
                    <p className="text-xs text-slate-500">{lead.createdAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 ${lead.sourceColor}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {lead.sourceIcon}
                      </span>
                      <span className="text-sm">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${lead.status.color}`}
                    >
                      {lead.status.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span
                        className={`material-symbols-outlined text-[16px] ${lead.quality.color}`}
                      >
                        star
                      </span>
                      <span className={`text-sm ${lead.quality.color}`}>
                        {lead.quality.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href="#"
                        className="p-1.5 rounded text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                        title="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          chat
                        </span>
                      </a>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-muted transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </Link>
                      <button
                        className="p-1.5 rounded text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Archive"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          archive
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
            <span className="font-medium text-slate-300">48</span> leads
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
