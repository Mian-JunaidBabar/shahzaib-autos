import {
  Calendar,
  AlertTriangle,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  CheckCircle2,
  Wallet,
  Clock,
  LayoutGrid,
} from "lucide-react";
import {
  getDashboardSummary,
  getRevenueOverTime,
  getTopSellingProducts,
  getBookingStatusDistribution,
  getRevenueByCategory,
  getTopBookedServices,
  getLowStockAlerts,
} from "@/app/actions/analyticsActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview | Admin",
};

import { getRecentActivityAction } from "@/app/actions/dashboardActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

// Charts
import { RevenueAreaChart } from "@/components/admin/charts/RevenueAreaChart";
import { TopProductsBarChart } from "@/components/admin/charts/TopProductsBarChart";
import { BookingStatusDonut } from "@/components/admin/charts/BookingStatusDonut";
import { CategoryRevenueBars } from "@/components/admin/charts/CategoryRevenueBars";
import { ChartSkeleton } from "@/components/admin/charts/chart-skeleton";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------
// DATA WRAPPERS WITH SUSPENSE
// ----------------------------------------------------------------------

async function RevenueChartWrapper() {
  const data = await getRevenueOverTime(30);
  return <RevenueAreaChart data={data} />;
}

async function BookingStatusChartWrapper() {
  const data = await getBookingStatusDistribution();
  return <BookingStatusDonut data={data} />;
}

async function CategoryRevenueWrapper() {
  const data = await getRevenueByCategory();
  return <CategoryRevenueBars data={data} />;
}

async function TopProductsChartWrapper() {
  const data = await getTopSellingProducts();
  return <TopProductsBarChart data={data} />;
}

async function LowStockAlertsWrapper() {
  const alerts = await getLowStockAlerts();

  if (alerts.length === 0) {
    return (
      <div className="text-slate-500 text-sm py-4">
        All inventory levels are healthy.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      {alerts.map((item) => (
        <div key={item.id} className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {item.name}
            </span>
            <span className="text-xs text-slate-500 uppercase">
              SKU: {item.sku}
            </span>
          </div>
          <span className="font-bold text-red-600 dark:text-red-500 text-sm text-right shrink-0">
            Qty: {item.quantity}
          </span>
        </div>
      ))}
    </div>
  );
}

async function RecentActivityWrapper() {
  const result = await getRecentActivityAction(5);
  const activities = result.success ? result.data || [] : [];

  if (activities.length === 0) {
    return (
      <div className="text-slate-500 text-sm py-4">No recent activity</div>
    );
  }

  const getActivityIconAndColor = (type: string) => {
    switch (type) {
      case "order":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          bg: "bg-emerald-100",
          text: "text-emerald-500",
        };
      case "booking":
        return {
          icon: <Calendar className="h-5 w-5" />,
          bg: "bg-blue-100",
          text: "text-blue-500",
        };
      case "lead":
        return {
          icon: <Wallet className="h-5 w-5" />,
          bg: "bg-amber-100",
          text: "text-amber-500",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          bg: "bg-slate-100",
          text: "text-slate-500",
        };
    }
  };

  return (
    <div className="flex flex-col gap-5 mt-2">
      {activities.map((activity) => {
        const style = getActivityIconAndColor(activity.type);
        return (
          <div key={activity.id} className="flex items-center gap-4">
            <div
              className={`p-2.5 rounded-full shrink-0 ${style.bg} ${style.text}`}
            >
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                {activity.title}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {activity.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN DASHBOARD PAGE
// ----------------------------------------------------------------------

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-20">
      {/* Top Header Row */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tight flex items-center gap-2">
              Shahzaib Autos
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">
              Command Center
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              <Calendar className="w-5 h-5" />
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-10 rounded-lg px-4 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
            >
              <Download className="w-4 h-4" />
              <span className="font-semibold">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Mock Calendar Widget matches the design */}
        <Card className="rounded-3xl border-0 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between font-bold text-sm mb-6">
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                {"<"}
              </button>
              <span className="text-slate-900 dark:text-white">
                October 2023
              </span>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                {">"}
              </button>
            </div>
            <div className="flex justify-between items-center text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {day}
                  </span>
                  <span
                    className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full ${i === 2 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30" : i === 3 ? "bg-blue-600 text-white shadow-md" : "text-slate-700 dark:text-slate-300"} ${(i === 0 || i === 1) && "opacity-30"}`}
                  >
                    {i === 0 ? "29" : i === 1 ? "30" : i}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-[24px] border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${summary.totalRevenue.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Orders
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {summary.pendingOrders}
              </span>
              <div className="flex items-center gap-1 text-red-500 font-bold text-xs mt-1">
                <TrendingDown className="w-3 h-3" />
                <span>-2.4%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Bookings
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {summary.activeBookings}
              </span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+5.0%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[24px] border-0 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Low Stock
              </span>
              <span className="text-2xl font-black text-red-600 dark:text-red-500">
                {summary.lowStockItems}
              </span>
              <div className="flex items-center gap-1 text-red-600 font-bold text-xs mt-1">
                <AlertTriangle className="w-3 h-3 fill-current" />
                <span>Critical</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Large Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Timeline Chart */}
            <Card className="rounded-[32px] border-0 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                      Revenue & Orders Timeline
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-black">
                        $
                        {(summary.totalRevenue / 3.65)
                          .toFixed(0)
                          .toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / 30d
                      </span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100 border-0 font-bold px-2 py-0.5 shadow-none rounded-md">
                    +8%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense fallback={<ChartSkeleton />}>
                  <RevenueChartWrapper />
                </Suspense>
              </CardContent>
            </Card>

            {/* Booking Status Donut */}
            <Card className="rounded-[32px] border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-2 border-b-0">
                <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                  Booking Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Suspense fallback={<ChartSkeleton />}>
                  <BookingStatusChartWrapper />
                </Suspense>
              </CardContent>
            </Card>

            {/* Revenue Category Progress Bars */}
            <Card className="rounded-[32px] border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-2 border-b-0">
                <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                  Revenue by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Suspense fallback={<ChartSkeleton />}>
                  <CategoryRevenueWrapper />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Top Selling Products Bar Chart */}
            <Card className="rounded-[32px] border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-2 border-b-0">
                <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                  Top 5 Selling Products
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Suspense fallback={<ChartSkeleton />}>
                  <TopProductsChartWrapper />
                </Suspense>
              </CardContent>
            </Card>

            {/* Critical Stock Alerts with striking visual frame */}
            <Card className="rounded-[24px] border-0 shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#fb1034]" />
              <CardHeader className="p-6 pb-2 border-b-0 flex flex-row items-center gap-3">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                  Critical Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <Suspense fallback={<ChartSkeleton />}>
                  <LowStockAlertsWrapper />
                </Suspense>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="rounded-[32px] border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader className="p-6 pb-2 border-b-0">
                <CardTitle className="text-sm font-bold m-0 p-0 text-slate-900 dark:text-white">
                  Recent Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4">
                <Suspense fallback={<ChartSkeleton />}>
                  <RecentActivityWrapper />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
