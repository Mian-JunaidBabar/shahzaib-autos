"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

type GrowthData = {
  date: string;
  newCustomers: number;
};

export function CustomerGrowthLineChart({ data }: { data: GrowthData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No growth data available.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg text-sm">
          <p className="font-bold text-popover-foreground mb-2">
            {format(new Date(label), "MMM do, yyyy")}
          </p>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-500 font-black">
              New Signups: {payload[0].value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            opacity={0.4}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM dd")}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b" }}
            minTickGap={20}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="newCustomers"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              fill: "#10b981",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
