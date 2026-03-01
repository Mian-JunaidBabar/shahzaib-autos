"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format, subDays, startOfDay, endOfDay, isEqual } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Pre-defined date range presets
const presets = [
  {
    label: "Today",
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Yesterday",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Last 30 Days",
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
];

interface DashboardDateFilterProps {
  className?: string;
}

export function DashboardDateFilter({ className }: DashboardDateFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse dates from URL params or use default (last 30 days)
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const getInitialRange = (): DateRange => {
    if (fromParam && toParam) {
      return {
        from: new Date(fromParam),
        to: new Date(toParam),
      };
    }
    // Default to last 30 days
    return {
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    };
  };

  const [date, setDate] = React.useState<DateRange | undefined>(
    getInitialRange,
  );
  const [open, setOpen] = React.useState(false);

  // Update URL when date changes
  const updateUrlParams = React.useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from || !range?.to) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("from", format(range.from, "yyyy-MM-dd"));
      params.set("to", format(range.to, "yyyy-MM-dd"));

      router.push(`${pathname}?${params.toString()}`);
      setOpen(false);
    },
    [pathname, router, searchParams],
  );

  // Handle preset selection
  const handlePresetClick = (preset: (typeof presets)[0]) => {
    const range = preset.getValue();
    setDate(range);
    updateUrlParams(range);
  };

  // Handle custom range selection
  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    // Only update URL when both from and to are selected
    if (range?.from && range?.to) {
      updateUrlParams(range);
    }
  };

  // Determine which preset matches current selection
  const getActivePreset = () => {
    if (!date?.from || !date?.to) return null;
    return presets.find((preset) => {
      const presetRange = preset.getValue();
      return (
        isEqual(startOfDay(date.from!), startOfDay(presetRange.from)) &&
        isEqual(startOfDay(date.to!), startOfDay(presetRange.to))
      );
    })?.label;
  };

  const activePreset = getActivePreset();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-65 justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <div className="flex">
            {/* Presets sidebar */}
            <div className="flex flex-col gap-1 p-3 border-r border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Quick Select
              </p>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "justify-start text-sm",
                    activePreset === preset.label &&
                      "bg-blue-50 text-blue-600 font-medium",
                  )}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleSelect}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
