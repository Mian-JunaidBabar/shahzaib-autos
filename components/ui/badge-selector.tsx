"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      {/* Selected badge display */}
      {selectedBadge && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-input bg-accent">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: selectedBadge.color }}
          ></div>
          <span className="text-sm font-medium flex-1">
            {selectedBadge.name}
          </span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Badge grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
        {badges.length === 0 ? (
          <div className="col-span-full text-center py-4 text-sm text-muted-foreground">
            No badges available
          </div>
        ) : (
          badges.map((badge) => (
            <button
              key={badge.id}
              type="button"
              onClick={() =>
                onChange(value === badge.id ? undefined : badge.id)
              }
              disabled={!badge.isActive}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border-2 transition-all hover:border-foreground/50",
                value === badge.id
                  ? "border-foreground bg-accent"
                  : "border-transparent hover:bg-accent/50",
                !badge.isActive && "opacity-50 cursor-not-allowed",
              )}
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: badge.color }}
              ></div>
              <span className="text-xs font-medium truncate">{badge.name}</span>
            </button>
          ))
        )}
      </div>

      {!selectedBadge && (
        <p className="text-xs text-muted-foreground">
          Select a badge or leave empty
        </p>
      )}
    </div>
  );
}
