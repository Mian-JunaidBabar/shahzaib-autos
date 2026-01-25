import Link from "next/link";

const teamMembers = [
  {
    id: 1,
    name: "Rahul Sharma",
    initials: "RS",
    email: "rahul.sharma@shahzaibautos.com",
    createdAt: "Oct 24, 2023",
    role: {
      name: "Admin",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: "security",
    },
    status: {
      name: "Active",
      color: "bg-success/10 text-success border-success/20",
      dotColor: "bg-success",
    },
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    id: 2,
    name: "Anita Patel",
    initials: "AP",
    email: "anita.p@shahzaibautos.com",
    createdAt: "Nov 12, 2023",
    role: {
      name: "Manager",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: "manage_accounts",
    },
    status: {
      name: "Active",
      color: "bg-success/10 text-success border-success/20",
      dotColor: "bg-success",
    },
    gradient: "from-slate-700 to-slate-600",
  },
  {
    id: 3,
    name: "Vikram Kumar",
    initials: "VK",
    email: "vikram.k@shahzaibautos.com",
    createdAt: "Dec 05, 2023",
    role: {
      name: "Manager",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: "manage_accounts",
    },
    status: {
      name: "Inactive",
      color: "bg-slate-700/50 text-slate-400 border-border",
      dotColor: "bg-slate-500",
    },
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: 4,
    name: "Sarah Miller",
    initials: "SM",
    email: "sarah.miller@shahzaibautos.com",
    createdAt: "Jan 15, 2024",
    role: {
      name: "Manager",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: "manage_accounts",
    },
    status: {
      name: "Pending",
      color: "bg-warning/10 text-warning border-warning/20",
      dotColor: "bg-warning animate-pulse",
    },
    gradient: "from-orange-600 to-red-700",
  },
  {
    id: 5,
    name: "David Lee",
    initials: "DL",
    email: "david.lee@shahzaibautos.com",
    createdAt: "Feb 02, 2024",
    role: {
      name: "Admin",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: "security",
    },
    status: {
      name: "Active",
      color: "bg-success/10 text-success border-success/20",
      dotColor: "bg-success",
    },
    gradient: "from-indigo-600 to-indigo-900",
  },
];

export default function TeamPage() {
  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link
              className="hover:text-primary transition-colors"
              href="/admin/settings"
            >
              Settings
            </Link>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span>Team Management</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Admin Team
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-slate-400">
              12 Members
            </span>
          </h1>
        </div>
        <div>
          <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 group">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform duration-300">
              add
            </span>
            Add User
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
            placeholder="Search by name, email or role..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-muted hover:bg-muted/80 rounded-lg border border-border transition-colors whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-slate-400 font-medium text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teamMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-xs font-bold text-white shadow-inner`}
                      >
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-slate-200 font-medium">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Created {member.createdAt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${member.role.color} text-xs font-medium border`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {member.role.icon}
                        </span>
                        {member.role.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${member.status.color} text-xs font-medium border`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${member.status.dotColor}`}
                      ></span>
                      {member.status.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-muted transition-colors"
                        title="Edit User"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        className="p-1.5 rounded text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove User"
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
            <span className="font-medium text-slate-300">12</span> users
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
