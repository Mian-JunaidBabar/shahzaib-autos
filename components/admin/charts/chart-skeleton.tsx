"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export function ChartSkeleton() {
  const [barHeights] = useState(() =>
    [...Array(7)].map(() => Math.max(20, Math.random() * 100)),
  );

  return (
    <div className="flex flex-col space-y-4 w-full h-full min-h-75 justify-center">
      <div className="flex justify-between items-center w-full mb-4 px-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl relative overflow-hidden flex items-end p-4 gap-2">
        {/* Mock bars for the skeleton */}
        {barHeights.map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm opacity-50"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
