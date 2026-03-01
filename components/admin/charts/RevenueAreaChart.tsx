"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

type RevenueData = {
  date: string;
  revenue: number;
  orders: number;
};

export function RevenueAreaChart({ data }: { data: RevenueData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500">
        No revenue data available for this period.
      </div>
    );
  }

  const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-sm">
          <p className="font-bold text-slate-900 dark:text-white mb-2">
            {format(new Date(label), "MMM do, yyyy")}
          </p>
          <div className="flex flex-col gap-1">
            <span className="text-primary font-black">
              Revenue: {formatCurrency(payload[0].value)}
            </span>
            <span className="text-slate-500 font-medium">
              Orders: {payload[0].payload.orders}
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
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
            opacity={0.2}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM dd")}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b" }}
            minTickGap={20}
          />
          <YAxis
            tickFormatter={(value) =>
              `Rs.${value >= 1000 ? (value / 1000).toFixed(1) + "k" : value}`
            }
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b" }}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0ea5e9"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
