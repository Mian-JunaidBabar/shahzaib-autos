"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type ServiceData = {
  name: string;
  bookings: number;
};

export function TopServicesBarChart({ data }: { data: ServiceData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No service booking data available.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-popover p-3 shadow-lg text-sm">
          <p className="font-bold text-popover-foreground capitalize mb-1">
            {payload[0].payload.name?.replace(/_/g, " ")}
          </p>
          <span className="text-indigo-500 font-black">
            Bookings: {payload[0].value}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            opacity={0.4}
          />
          <XAxis
            dataKey="name"
            tickFormatter={(value) =>
              value?.substring(0, 10).replace(/_/g, " ")
            }
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="bookings"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
