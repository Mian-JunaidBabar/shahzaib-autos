"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface OperatingHours {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_OPERATING_HOURS: OperatingHours[] = [
  { dayOfWeek: 0, isOpen: false, openTime: "", closeTime: "" },
  { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { dayOfWeek: 6, isOpen: false, openTime: "", closeTime: "" },
];

export default function BookingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slotDuration, setSlotDuration] = useState("60");
  const [bufferTime, setBufferTime] = useState("15");
  const [advanceBookingDays, setAdvanceBookingDays] = useState("30");
  const [allowSameDayBooking, setAllowSameDayBooking] = useState(true);
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/booking", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setSlotDuration(String(data.slotDuration || 60));
        setBufferTime(String(data.bufferTime || 15));
        setAdvanceBookingDays(String(data.advanceBookingDays || 30));
        setAllowSameDayBooking(data.allowSameDayBooking !== false);
        setOperatingHours(
          Array.isArray(data.operatingHours) && data.operatingHours.length > 0
            ? data.operatingHours
            : DEFAULT_OPERATING_HOURS,
        );
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load booking settings");
    } finally {
      setLoading(false);
    }
  };

  const updateOperatingHours = (
    dayOfWeek: number,
    field: string,
    value: unknown,
  ) => {
    setOperatingHours((prev) =>
      prev.map((hour) =>
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour,
      ),
    );
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings/booking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotDuration: parseInt(slotDuration),
          bufferTime: parseInt(bufferTime),
          advanceBookingDays: parseInt(advanceBookingDays),
          allowSameDayBooking,
          operatingHours,
        }),
      });

      if (response.ok) {
        toast.success("Booking settings saved successfully");
      } else {
        toast.error("Failed to save booking settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving booking settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading booking settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure scheduling and availability
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure time slots and booking rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="slot-duration">Slot Duration (minutes)</Label>
              <Input
                id="slot-duration"
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                min="15"
                step="15"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Length of each appointment slot
              </p>
            </div>

            <div>
              <Label htmlFor="buffer-time">Buffer Time (minutes)</Label>
              <Input
                id="buffer-time"
                type="number"
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                min="0"
                step="5"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Time between appointments
              </p>
            </div>

            <div>
              <Label htmlFor="advance-days">Advance Booking (days)</Label>
              <Input
                id="advance-days"
                type="number"
                value={advanceBookingDays}
                onChange={(e) => setAdvanceBookingDays(e.target.value)}
                min="1"
                max="365"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far in advance customers can book
              </p>
            </div>

            <div className="flex items-center gap-3 pt-8">
              <Checkbox
                id="same-day"
                checked={allowSameDayBooking}
                onCheckedChange={(checked) =>
                  setAllowSameDayBooking(checked === true)
                }
              />
              <Label htmlFor="same-day" className="cursor-pointer">
                Allow same-day bookings
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>
            Set opening hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {operatingHours.map((hours) => (
              <div
                key={hours.dayOfWeek}
                className="grid grid-cols-4 gap-4 items-center p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`day-${hours.dayOfWeek}`}
                    checked={hours.isOpen}
                    onCheckedChange={(checked) =>
                      updateOperatingHours(
                        hours.dayOfWeek,
                        "isOpen",
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`day-${hours.dayOfWeek}`}
                    className="font-medium min-w-24"
                  >
                    {DAYS_OF_WEEK[hours.dayOfWeek]}
                  </Label>
                </div>

                {hours.isOpen ? (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Open
                      </Label>
                      <Input
                        type="time"
                        value={hours.openTime}
                        onChange={(e) =>
                          updateOperatingHours(
                            hours.dayOfWeek,
                            "openTime",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Close
                      </Label>
                      <Input
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) =>
                          updateOperatingHours(
                            hours.dayOfWeek,
                            "closeTime",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-sm text-muted-foreground">
                    Closed
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={saveSettings} disabled={saving} className="px-6">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={fetchSettings}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
