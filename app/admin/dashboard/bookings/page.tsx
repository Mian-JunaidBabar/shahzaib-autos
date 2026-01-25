"use client";

import { useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  service: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    plateNumber: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  notes: string;
}

const bookingsData: Booking[] = [
  {
    id: "BK001",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
    },
    service: "Oil Change & Filter",
    vehicleInfo: {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      plateNumber: "ABC-1234",
    },
    date: "2024-01-25",
    time: "10:00 AM",
    status: "confirmed",
    notes: "Customer mentioned strange engine noise",
  },
  {
    id: "BK002",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 987-6543",
    },
    service: "Brake Inspection",
    vehicleInfo: {
      make: "Honda",
      model: "Civic",
      year: 2019,
      plateNumber: "XYZ-5678",
    },
    date: "2024-01-25",
    time: "2:00 PM",
    status: "pending",
    notes: "First time customer",
  },
  {
    id: "BK003",
    customer: {
      name: "Mike Wilson",
      email: "mike.w@example.com",
      phone: "+1 (555) 456-7890",
    },
    service: "Full Service",
    vehicleInfo: {
      make: "BMW",
      model: "X5",
      year: 2021,
      plateNumber: "BMW-9999",
    },
    date: "2024-01-26",
    time: "9:00 AM",
    status: "in-progress",
    notes: "VIP customer - comprehensive service required",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-orange-600 bg-orange-50";
    case "confirmed":
      return "text-blue-600 bg-blue-50";
    case "in-progress":
      return "text-purple-600 bg-purple-50";
    case "completed":
      return "text-green-600 bg-green-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleInfo.make.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookingsData.length,
    pending: bookingsData.filter((b) => b.status === "pending").length,
    confirmed: bookingsData.filter((b) => b.status === "confirmed").length,
    inProgress: bookingsData.filter((b) => b.status === "in-progress").length,
    completed: bookingsData.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Service Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage customer service appointments
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            New Booking
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              event_available
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>
            <span className="material-symbols-outlined text-orange-500 bg-orange-50 p-2 rounded-full">
              pending
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-500 bg-blue-50 p-2 rounded-full">
              check_circle
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.inProgress}
              </p>
            </div>
            <span className="material-symbols-outlined text-purple-500 bg-purple-50 p-2 rounded-full">
              sync
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-full">
              task_alt
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
            placeholder="Search bookings..."
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Booking ID
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Service
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Vehicle
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Date & Time
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-border">
                  <td className="p-4">
                    <Link
                      href={`/admin/dashboard/bookings/${booking.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {booking.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.customer.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">
                      {booking.service}
                    </p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.vehicleInfo.year} {booking.vehicleInfo.make}{" "}
                        {booking.vehicleInfo.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.vehicleInfo.plateNumber}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {booking.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/bookings/${booking.id}`}
                        className="text-muted-foreground hover:text-primary"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </Link>
                      <button
                        className="text-muted-foreground hover:text-primary"
                        title="Edit Booking"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-red-500"
                        title="Cancel Booking"
                      >
                        <span className="material-symbols-outlined">
                          cancel
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

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-muted-foreground text-4xl mb-4">
            event_busy
          </span>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No bookings found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No service bookings have been created yet"}
          </p>
        </div>
      )}
    </div>
  );
}
