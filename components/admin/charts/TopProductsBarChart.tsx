"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

type ProductData = {
  name: string;
  quantity: number;
  productId: string;
};

export function TopProductsBarChart({ data }: { data: ProductData[] }) {
  const router = useRouter();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-75 text-slate-500">
        No product data available.
      </div>
    );
  }

  const handleBarClick = (productData: ProductData) => {
    if (productData.productId) {
      router.push(`/admin/dashboard/inventory/${productData.productId}`);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 text-sm">
          <p className="font-bold text-slate-900 dark:text-white mb-1">
            {payload[0].payload.name}
          </p>
          <span className="text-primary font-black">
            Sold: {payload[0].value} units
          </span>
          <p className="text-xs text-slate-500 mt-1">Click to view details</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-75 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
        >
          {/* Hide grid lines for cleaner look as requested */}
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            vertical={false}
          />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            width={100}
            // Add a little truncation logic if name is too long
            tickFormatter={(value) =>
              value.length > 15 ? `${value.substring(0, 15)}...` : value
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
          />
          <Bar
            dataKey="quantity"
            fill="#2563eb"
            radius={[0, 4, 4, 0]}
            barSize={24}
            style={{ cursor: "pointer" }}
            onClick={(data) => handleBarClick(data)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                className="hover:fill-blue-700 transition-colors"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
