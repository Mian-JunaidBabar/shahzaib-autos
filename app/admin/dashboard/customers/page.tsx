"use client";

import { useState } from "react";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateJoined: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "vip";
  lastOrderDate?: string;
  notes: string;
  vehicleCount: number;
}

const customersData: Customer[] = [
  {
    id: "CUST001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, AT 12345",
    dateJoined: "2023-06-15T09:30:00Z",
    totalOrders: 12,
    totalSpent: 1250.75,
    status: "vip",
    lastOrderDate: "2024-01-20T10:30:00Z",
    notes:
      "VIP customer, prefers premium services. Regular maintenance for company fleet.",
    vehicleCount: 3,
  },
  {
    id: "CUST002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Avenue, Somewhere, SW 67890",
    dateJoined: "2023-09-22T14:15:00Z",
    totalOrders: 6,
    totalSpent: 485.5,
    status: "active",
    lastOrderDate: "2024-01-18T16:45:00Z",
    notes: "Regular customer, prefers appointments on weekends.",
    vehicleCount: 1,
  },
  {
    id: "CUST003",
    name: "Mike Wilson",
    email: "mike.w@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Road, Another City, AC 13579",
    dateJoined: "2022-11-10T11:20:00Z",
    totalOrders: 25,
    totalSpent: 3200.25,
    status: "vip",
    lastOrderDate: "2024-01-15T09:00:00Z",
    notes:
      "Long-time customer, owns luxury vehicles. Prefers premium services only.",
    vehicleCount: 2,
  },
  {
    id: "CUST004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 321-0987",
    address: "321 Elm Street, Different Town, DT 24680",
    dateJoined: "2024-01-05T08:45:00Z",
    totalOrders: 1,
    totalSpent: 89.99,
    status: "active",
    lastOrderDate: "2024-01-10T13:30:00Z",
    notes: "New customer, referred by Sarah Johnson.",
    vehicleCount: 1,
  },
  {
    id: "CUST005",
    name: "Robert Brown",
    email: "r.brown@example.com",
    phone: "+1 (555) 654-3210",
    address: "654 Maple Drive, Old City, OC 97531",
    dateJoined: "2023-03-20T16:30:00Z",
    totalOrders: 8,
    totalSpent: 720.0,
    status: "inactive",
    lastOrderDate: "2023-11-15T10:15:00Z",
    notes: "Has not visited in months. Should follow up for retention.",
    vehicleCount: 1,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "vip":
      return "text-purple-600 bg-purple-50";
    case "active":
      return "text-green-600 bg-green-50";
    case "inactive":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customersData.length,
    active: customersData.filter((c) => c.status === "active").length,
    vip: customersData.filter((c) => c.status === "vip").length,
    inactive: customersData.filter((c) => c.status === "inactive").length,
    totalRevenue: customersData.reduce(
      (sum, customer) => sum + customer.totalSpent,
      0,
    ),
    avgOrderValue:
      customersData.reduce((sum, customer) => sum + customer.totalSpent, 0) /
      customersData.reduce((sum, customer) => sum + customer.totalOrders, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            Manage customer relationships and history
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">file_download</span>
              Export
            </span>
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              Add Customer
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Customers</p>
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
              person_check
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">VIP</p>
              <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
            </div>
            <span className="material-symbols-outlined text-purple-500 bg-purple-50 p-2 rounded-full">
              star
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

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-2 rounded-full">
              monetization_on
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.avgOrderValue.toFixed(0)}
              </p>
            </div>
            <span className="material-symbols-outlined text-cyan-500 bg-cyan-50 p-2 rounded-full">
              analytics
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
            placeholder="Search customers..."
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
          <option value="active">Active</option>
          <option value="vip">VIP</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Joined
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Orders
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Total Spent
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Last Order
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-border">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">
                          person
                        </span>
                      </div>
                      <div>
                        <Link
                          href={`/admin/dashboard/customers/${customer.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {customer.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {customer.vehicleCount} vehicle
                          {customer.vehicleCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-foreground">
                        {customer.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">
                      {new Date(customer.dateJoined).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      {customer.totalOrders}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      ${customer.totalSpent.toLocaleString()}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : "Never"}
                    </p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(customer.status)}`}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/customers/${customer.id}`}
                        className="text-muted-foreground hover:text-primary"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </Link>
                      <button
                        className="text-muted-foreground hover:text-primary"
                        title="Edit Customer"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-green-500"
                        title="Call Customer"
                      >
                        <span className="material-symbols-outlined">call</span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-blue-500"
                        title="Send Email"
                      >
                        <span className="material-symbols-outlined">email</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-muted-foreground text-4xl mb-4">
            people_outline
          </span>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No customers found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No customers have been added yet"}
          </p>
        </div>
      )}
    </div>
  );
}
