"use client";

import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  permissions: string[];
  avatar?: string;
  phone: string;
  lastActive: string;
}

const teamData: TeamMember[] = [
  {
    id: "TEAM001",
    name: "Sarah Johnson",
    email: "sarah@shahzaibautos.com",
    role: "Manager",
    department: "Administration",
    status: "active",
    joinDate: "2023-01-15T09:00:00Z",
    permissions: ["admin", "orders", "customers", "inventory", "reports"],
    phone: "+1 (555) 123-4567",
    lastActive: "2024-01-24T15:30:00Z",
  },
  {
    id: "TEAM002",
    name: "Mike Wilson",
    email: "mike@shahzaibautos.com",
    role: "Senior Technician",
    department: "Service",
    status: "active",
    joinDate: "2022-06-20T08:30:00Z",
    permissions: ["bookings", "customers", "inventory"],
    phone: "+1 (555) 234-5678",
    lastActive: "2024-01-24T14:45:00Z",
  },
  {
    id: "TEAM003",
    name: "Emily Davis",
    email: "emily@shahzaibautos.com",
    role: "Sales Representative",
    department: "Sales",
    status: "active",
    joinDate: "2023-03-10T09:15:00Z",
    permissions: ["leads", "customers", "orders"],
    phone: "+1 (555) 345-6789",
    lastActive: "2024-01-24T16:00:00Z",
  },
  {
    id: "TEAM004",
    name: "David Brown",
    email: "david@shahzaibautos.com",
    role: "Technician",
    department: "Service",
    status: "on-leave",
    joinDate: "2023-08-05T08:00:00Z",
    permissions: ["bookings", "inventory"],
    phone: "+1 (555) 456-7890",
    lastActive: "2024-01-15T17:30:00Z",
  },
  {
    id: "TEAM005",
    name: "Lisa Martinez",
    email: "lisa@shahzaibautos.com",
    role: "Customer Service",
    department: "Administration",
    status: "active",
    joinDate: "2023-11-01T09:30:00Z",
    permissions: ["customers", "bookings", "leads"],
    phone: "+1 (555) 567-8901",
    lastActive: "2024-01-24T13:20:00Z",
  },
];

const roles = [
  "Manager",
  "Senior Technician",
  "Technician",
  "Sales Representative",
  "Customer Service",
  "Admin",
];
const departments = ["Administration", "Service", "Sales", "Finance"];
const allPermissions = [
  { id: "admin", label: "Admin Access" },
  { id: "orders", label: "Order Management" },
  { id: "customers", label: "Customer Management" },
  { id: "inventory", label: "Inventory Management" },
  { id: "bookings", label: "Booking Management" },
  { id: "leads", label: "Lead Management" },
  { id: "reports", label: "Reports & Analytics" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50";
    case "inactive":
      return "text-red-600 bg-red-50";
    case "on-leave":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTeamMembers = teamData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: teamData.length,
    active: teamData.filter((m) => m.status === "active").length,
    onLeave: teamData.filter((m) => m.status === "on-leave").length,
    inactive: teamData.filter((m) => m.status === "inactive").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff members, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">person_add</span>
            Add Team Member
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Members</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              people
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-full">
              check_circle
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">On Leave</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.onLeave}
              </p>
            </div>
            <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2 rounded-full">
              schedule
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.inactive}
              </p>
            </div>
            <span className="material-symbols-outlined text-red-500 bg-red-50 p-2 rounded-full">
              person_off
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            search
          </span>
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Team Members Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Member
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Department
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Last Active
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeamMembers.map((member) => (
                <tr key={member.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{member.role}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">{member.department}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{member.phone}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}
                    >
                      {member.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-muted-foreground hover:text-primary"
                        title="View Profile"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-primary"
                        title="Edit Member"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-green-500"
                        title="Permissions"
                      >
                        <span className="material-symbols-outlined">
                          security
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Add Team Member
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm text-foreground">
                        {permission.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredTeamMembers.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-muted-foreground text-4xl mb-4">
            people_outline
          </span>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No team members found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No team members have been added yet"}
          </p>
        </div>
      )}
    </div>
  );
}
