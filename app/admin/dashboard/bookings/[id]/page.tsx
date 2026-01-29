"use client";

import {
  getBookingAction,
  updateBookingStatusAction,
} from "@/app/actions/bookingActions";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type BookingDetailsPageProps = {
  params: Promise<{ id: string }>;
};

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  address: string;
  serviceType: string;
  vehicleInfo: string;
  date: Date;
  timeSlot: string;
  status: string;
  notes?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "text-blue-600 bg-blue-50";
    case "PENDING":
      return "text-orange-600 bg-orange-50";
    case "IN_PROGRESS":
      return "text-purple-600 bg-purple-50";
    case "COMPLETED":
      return "text-green-600 bg-green-50";
    case "CANCELLED":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const [id, setId] = useState<string>("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      const result = await getBookingAction(resolvedParams.id);
      if (result.success && result.data) {
        setBooking(result.data as Booking);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [params]);

  const fetchTimeSlots = async () => {
    setSlotsLoading(true);
    try {
      // Fetch from settings endpoint
      const response = await fetch("/api/settings/booking", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.bookingTimeSlots || generateDefaultSlots());
      } else {
        setTimeSlots(generateDefaultSlots());
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots(generateDefaultSlots());
    } finally {
      setSlotsLoading(false);
    }
  };

  const generateDefaultSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const ampm = hour < 12 ? "AM" : "PM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 ${ampm}`);
    }
    return slots;
  };

  const handleOpenReschedule = () => {
    fetchTimeSlots();
    setIsRescheduleOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;

    setIsUpdating(true);
    try {
      const result = await updateBookingStatusAction(id, newStatus);
      if (result.success) {
        setBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success("Booking status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select date and time");
      return;
    }

    if (!id) return;

    setIsUpdating(true);
    try {
      // Update booking with new date and time
      const result = await updateBookingStatusAction(
        id,
        booking?.status || "PENDING",
        {
          date: format(rescheduleDate, "yyyy-MM-dd"),
          timeSlot: rescheduleTime,
        },
      );

      if (result.success) {
        setBooking((prev) =>
          prev
            ? {
                ...prev,
                date: rescheduleDate,
                timeSlot: rescheduleTime,
              }
            : null,
        );
        setIsRescheduleOpen(false);
        setRescheduleDate(undefined);
        setRescheduleTime("");
        toast.success("Booking rescheduled successfully");
      } else {
        toast.error("Failed to reschedule booking");
      }
    } catch (error) {
      toast.error("Error rescheduling booking");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Booking Not Found
          </h1>
          <Link
            href="/admin/dashboard/bookings"
            className="text-blue-600 hover:underline"
          >
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/admin/dashboard/bookings"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Booking #{booking.bookingNumber}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
            >
              {booking.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-muted-foreground">
            Appointment scheduled for {booking.date.toLocaleDateString()} at{" "}
            {booking.timeSlot}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenReschedule}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
          >
            Reschedule
          </button>
          <Select
            value={booking.status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Details */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Service Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    {booking.serviceType}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Service scheduled for {booking.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Vehicle Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Vehicle
                  </label>
                  <p className="font-medium text-foreground">
                    {booking.vehicleInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Booking Status
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full text-green-500 bg-green-50">
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">
                      Booking Created
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Booking #{booking.bookingNumber} created for{" "}
                      {booking.customerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      booking.status === "CONFIRMED" ||
                      booking.status === "IN_PROGRESS" ||
                      booking.status === "COMPLETED"
                        ? "text-green-500 bg-green-50"
                        : "text-orange-500 bg-orange-50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {booking.status === "CONFIRMED" ||
                      booking.status === "IN_PROGRESS" ||
                      booking.status === "COMPLETED"
                        ? "check_circle"
                        : "schedule"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">
                      Current Status: {booking.status.replace("_", " ")}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Scheduled for {booking.date.toLocaleDateString()} at{" "}
                      {booking.timeSlot}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Customer Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium text-foreground">
                  {booking.customerName}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium text-foreground">
                  {booking.customerEmail || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium text-foreground">
                  {booking.customerPhone}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium text-foreground">{booking.address}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Appointment Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Date</label>
                <p className="font-medium text-foreground">
                  {booking.date.toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Time</label>
                <p className="font-medium text-foreground">
                  {booking.timeSlot}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="font-medium text-foreground">
                  {booking.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Special Notes
              </h2>
            </div>
            <div className="p-6">
              <p className="text-foreground">
                {booking.notes || "No special notes"}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">
                    schedule
                  </span>
                  <span className="text-foreground">
                    Reschedule Appointment
                  </span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500">
                    call
                  </span>
                  <span className="text-foreground">Call Customer</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-500">
                    email
                  </span>
                  <span className="text-foreground">Send Email</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">
                    cancel
                  </span>
                  <span className="text-foreground">Cancel Booking</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>
              Update the date and time for booking #{booking?.bookingNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <div className="flex justify-center border rounded-lg p-4 bg-muted/30">
                <Calendar
                  mode="single"
                  selected={rescheduleDate}
                  onSelect={setRescheduleDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-md"
                />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Select Time Slot</Label>
              {slotsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading time slots...
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setRescheduleTime(slot)}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        rescheduleTime === slot
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRescheduleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReschedule}
              disabled={isUpdating || !rescheduleDate || !rescheduleTime}
            >
              {isUpdating ? "Rescheduling..." : "Reschedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
