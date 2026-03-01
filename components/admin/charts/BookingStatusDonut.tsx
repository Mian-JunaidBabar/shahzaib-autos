"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type StatusData = {
  name: string;
  value: number;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#eab308", // Yellow (amber-500)
  CONFIRMED: "#2563eb", // Blue (blue-600)
  IN_PROGRESS: "#2563eb", // Blue
  COMPLETED: "#2563eb", // Blue
  CANCELLED: "#cbd5e1", // Gray (slate-300)
  NO_SHOW: "#cbd5e1", // Gray
};

export function BookingStatusDonut({ data }: { data: StatusData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500">
        No booking data available.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-sm flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="font-bold text-slate-900 dark:text-white">
            {payload[0].name}:
          </span>
          <span className="font-black">{payload[0].value}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full text-xs flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.name] || "#cbd5e1"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-slate-600 dark:text-slate-300 ml-1 font-medium">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
