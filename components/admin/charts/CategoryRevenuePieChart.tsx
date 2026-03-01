"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type CategoryData = {
  name: string;
  value: number;
};

const CATEGORY_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export function CategoryRevenuePieChart({ data }: { data: CategoryData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-500">
        No category revenue data available.
      </div>
    );
  }

  const formatCurrency = (value: number) => `Rs. ${value.toLocaleString()}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-sm flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <span className="font-bold text-slate-900 dark:text-white capitalize">
            {payload[0].name}:
          </span>
          <span className="font-black text-slate-700 dark:text-slate-200">
            {formatCurrency(payload[0].value)}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full text-xs flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-slate-600 dark:text-slate-300 ml-1 font-medium capitalize">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
