"use client";

import React from "react";

type CategoryData = {
  name: string;
  value: number;
};

// Colors matching the Stitch image: Blue, Green, Orange
const CATEGORY_COLORS = [
  "bg-blue-600",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-indigo-500",
];

export function CategoryRevenueBars({ data }: { data: CategoryData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
        No category revenue data available.
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-6 w-full py-2">
      {data.map((item, index) => {
        const percentage =
          total > 0 ? Math.round((item.value / total) * 100) : 0;
        const colorClass = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

        return (
          <div key={item.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-foreground capitalize">{item.name}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
