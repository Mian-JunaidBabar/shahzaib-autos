"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Badge {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface BadgeSelectorProps {
  badges: Badge[];
  value?: string;
  onChange: (badgeId: string | undefined) => void;
  label?: string;
}

export function BadgeSelector({
  badges,
  value,
  onChange,
  label = "Badge",
}: BadgeSelectorProps) {
  const selectedBadge = badges.find((b) => b.id === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        value={value || "none"}
        onValueChange={(val) => onChange(val === "none" ? undefined : val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a badge (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Clear selection)</SelectItem>
          {badges.map((badge) => (
            <SelectItem
              key={badge.id}
              value={badge.id}
              disabled={!badge.isActive}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: badge.color }}
                ></div>
                <span>{badge.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBadge && (
        <div className="flex items-center gap-2 p-2 rounded-lg border border-input bg-muted/40">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: selectedBadge.color }}
          ></div>
          <span className="text-xs font-medium">{selectedBadge.name}</span>
        </div>
      )}
    </div>
  );
}
