"use client";

import {
  getBookingAction,
  getAvailableSlotsAction,
  rescheduleBookingAction,
  updateBookingStatusAction,
} from "@/app/actions/bookingActions";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  timeSlot: string | null;
  status: string;
  notes?: string;
  activityLog?: Array<{
    id: string;
    activity: string;
    createdAt: Date;
  }>;
}

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

  useEffect(() => {
    const fetchBooking = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);

      const result = await getBookingAction(resolvedParams.id);
      if (result.success && result.data) {
        const data = result.data as Booking;
        const normalizedBooking: Booking = {
          ...data,
          date: new Date(data.date),
          activityLog: data.activityLog?.map((log) => ({
            ...log,
            createdAt: new Date(log.createdAt),
          })),
        };
        setBooking(normalizedBooking);
      }
      setLoading(false);
    };

    fetchBooking();
  }, [params]);

  const fetchTimeSlots = async (selectedDate: Date) => {
    setSlotsLoading(true);
    try {
      const result = await getAvailableSlotsAction(selectedDate.toISOString());
      if (result.success && result.data) {
        setTimeSlots(result.data);
        if (rescheduleTime && !result.data.includes(rescheduleTime)) {
          setRescheduleTime("");
        }
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (rescheduleDate) {
      fetchTimeSlots(rescheduleDate);
    }
  }, [rescheduleDate]);

  const handleOpenReschedule = () => {
    if (booking?.date) {
      setRescheduleDate(booking.date);
    }
    if (booking?.timeSlot) {
      setRescheduleTime(booking.timeSlot);
    }
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
      const result = await rescheduleBookingAction(
        id,
        rescheduleDate,
        rescheduleTime,
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

  const services = booking.serviceType
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/bookings"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Booking #{booking.bookingNumber}
            </h1>
            <p className="text-muted-foreground">
              Scheduled for {booking.date.toLocaleDateString()} at{" "}
              {booking.timeSlot || "TBD"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            booking.status,
          )}`}
        >
          {booking.status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Booking Details
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">
                  Booking #
                </label>
                <p className="font-medium text-foreground">
                  {booking.bookingNumber}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Date & Time
                </label>
                <p className="font-medium text-foreground">
                  {booking.date.toLocaleDateString()} •{" "}
                  {booking.timeSlot || "TBD"}
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

          {/* Customer & Vehicle */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Customer & Vehicle
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">
                  Customer
                </label>
                <p className="font-medium text-foreground">
                  {booking.customerName}
                </p>
                <a
                  href={`tel:${booking.customerPhone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {booking.customerPhone}
                </a>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle</label>
                <p className="font-medium text-foreground">
                  {booking.vehicleInfo || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Services Requested */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Services Requested
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">
                      check_circle
                    </span>
                    <span>{service}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No services listed</p>
              )}
              {booking.notes && (
                <div className="pt-4">
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <p className="text-foreground mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Button
                variant="outline"
                onClick={handleOpenReschedule}
                className="w-full"
              >
                Reschedule
              </Button>
              <Button
                onClick={() => handleStatusChange("CONFIRMED")}
                disabled={isUpdating}
                className="w-full"
              >
                Confirm Booking
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={isUpdating}
                className="w-full"
              >
                Cancel Booking
              </Button>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Booking History
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {booking.activityLog && booking.activityLog.length > 0 ? (
                booking.activityLog.map((log) => (
                  <div key={log.id} className="space-y-1">
                    <p className="text-foreground">{log.activity}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(log.createdAt, "PPP p")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No activity logged yet.</p>
              )}
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
                  initialFocus
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
              ) : timeSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No available time slots for this date.
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
