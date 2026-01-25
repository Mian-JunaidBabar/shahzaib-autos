"use client";

import { useState } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  source: "website" | "phone" | "email" | "referral" | "social" | "walk-in";
  interest: string;
  priority: "low" | "medium" | "high";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  notes: string;
  estimatedValue?: number;
}

const leadsData: Lead[] = [
  {
    id: "LD001",
    customer: {
      name: "Alex Rodriguez",
      email: "alex.rodriguez@example.com",
      phone: "+1 (555) 234-5678",
      company: "Rodriguez Logistics",
    },
    source: "website",
    interest: "Fleet maintenance contract",
    priority: "high",
    status: "qualified",
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-20T09:15:00Z",
    lastContact: "2024-01-22T14:30:00Z",
    notes:
      "Interested in monthly maintenance for 15 vehicles. Requested detailed quote.",
    estimatedValue: 12000,
  },
  {
    id: "LD002",
    customer: {
      name: "Emily Chen",
      email: "emily.chen@example.com",
      phone: "+1 (555) 345-6789",
    },
    source: "referral",
    interest: "Car detailing service",
    priority: "medium",
    status: "contacted",
    assignedTo: "Mike Wilson",
    createdDate: "2024-01-21T11:20:00Z",
    lastContact: "2024-01-21T16:45:00Z",
    notes:
      "Referred by John Smith. Looking for premium detailing for luxury car.",
    estimatedValue: 300,
  },
  {
    id: "LD003",
    customer: {
      name: "David Thompson",
      email: "d.thompson@example.com",
      phone: "+1 (555) 456-7890",
    },
    source: "phone",
    interest: "Engine repair",
    priority: "high",
    status: "new",
    assignedTo: "Tom Anderson",
    createdDate: "2024-01-23T08:30:00Z",
    lastContact: "2024-01-23T08:30:00Z",
    notes: "Called about engine issues with BMW. Needs immediate attention.",
    estimatedValue: 2500,
  },
  {
    id: "LD004",
    customer: {
      name: "Lisa Martinez",
      email: "lisa.m@example.com",
      phone: "+1 (555) 567-8901",
    },
    source: "social",
    interest: "Regular maintenance",
    priority: "low",
    status: "contacted",
    assignedTo: "Sarah Johnson",
    createdDate: "2024-01-19T15:45:00Z",
    lastContact: "2024-01-20T10:15:00Z",
    notes: "Found us on Instagram. Interested in regular maintenance schedule.",
    estimatedValue: 150,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "text-blue-600 bg-blue-50";
    case "contacted":
      return "text-orange-600 bg-orange-50";
    case "qualified":
      return "text-purple-600 bg-purple-50";
    case "converted":
      return "text-green-600 bg-green-50";
    case "lost":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-orange-600 bg-orange-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "website":
      return "language";
    case "phone":
      return "call";
    case "email":
      return "email";
    case "referral":
      return "person_add";
    case "social":
      return "share";
    case "walk-in":
      return "store";
    default:
      return "contact_page";
  }
};

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: leadsData.length,
    new: leadsData.filter((l) => l.status === "new").length,
    contacted: leadsData.filter((l) => l.status === "contacted").length,
    qualified: leadsData.filter((l) => l.status === "qualified").length,
    converted: leadsData.filter((l) => l.status === "converted").length,
    totalValue: leadsData.reduce(
      (sum, lead) => sum + (lead.estimatedValue || 0),
      0,
    ),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Leads</h1>
          <p className="text-muted-foreground">
            Manage and track potential customers
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Lead
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              contacts
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              new_releases
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Contacted</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.contacted}
              </p>
            </div>
            <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2 rounded-full">
              call_made
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Qualified</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.qualified}
              </p>
            </div>
            <span className="material-symbols-outlined text-purple-500 bg-purple-50 p-2 rounded-full">
              verified
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Converted</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.converted}
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
              <p className="text-muted-foreground text-sm">Est. Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-2 rounded-full">
              monetization_on
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
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Lead ID
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Interest
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Source
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Priority
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Assigned To
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Est. Value
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-border">
                  <td className="p-4">
                    <Link
                      href={`/admin/dashboard/leads/${lead.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {lead.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {lead.customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lead.customer.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lead.customer.phone}
                      </p>
                      {lead.customer.company && (
                        <p className="text-sm text-muted-foreground font-medium">
                          {lead.customer.company}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      {lead.interest}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-muted-foreground text-sm">
                        {getSourceIcon(lead.source)}
                      </span>
                      <span className="text-foreground capitalize">
                        {lead.source.replace("-", " ")}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(lead.priority)}`}
                    >
                      {lead.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      {lead.assignedTo}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      {lead.estimatedValue
                        ? `$${lead.estimatedValue.toLocaleString()}`
                        : "-"}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/leads/${lead.id}`}
                        className="text-muted-foreground hover:text-primary"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </Link>
                      <button
                        className="text-muted-foreground hover:text-primary"
                        title="Edit Lead"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-green-500"
                        title="Contact Lead"
                      >
                        <span className="material-symbols-outlined">call</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-muted-foreground text-4xl mb-4">
            contact_page
          </span>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No leads found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No sales leads have been created yet"}
          </p>
        </div>
      )}
    </div>
  );
}
