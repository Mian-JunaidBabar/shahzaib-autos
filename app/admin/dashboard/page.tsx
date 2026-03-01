import {
  DollarSign,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  UserPlus,
  ShoppingCart,
  FileText,
  Download,
  Package,
} from "lucide-react";
import {
  getDashboardSummary,
  getRevenueOverTime,
  getTopSellingProducts,
  getBookingStatusDistribution,
  getCustomerGrowth,
  getRevenueByCategory,
  getTopBookedServices,
  getLowStockAlerts,
} from "@/app/actions/analyticsActions";
import { getRecentActivityAction } from "@/app/actions/dashboardActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import Link from "next/link";

// Charts
import { RevenueAreaChart } from "@/components/admin/charts/RevenueAreaChart";
import { TopProductsBarChart } from "@/components/admin/charts/TopProductsBarChart";
import { BookingStatusDonut } from "@/components/admin/charts/BookingStatusDonut";
import { CustomerGrowthLineChart } from "@/components/admin/charts/CustomerGrowthLineChart";
import { CategoryRevenuePieChart } from "@/components/admin/charts/CategoryRevenuePieChart";
import { TopServicesBarChart } from "@/components/admin/charts/TopServicesBarChart";
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

async function CustomerGrowthWrapper() {
  const data = await getCustomerGrowth(30);
  return <CustomerGrowthLineChart data={data} />;
}

async function CategoryRevenueWrapper() {
  const data = await getRevenueByCategory();
  return <CategoryRevenuePieChart data={data} />;
}

async function TopProductsChartWrapper() {
  const data = await getTopSellingProducts();
  return <TopProductsBarChart data={data} />;
}

async function TopServicesWrapper() {
  const data = await getTopBookedServices();
  return <TopServicesBarChart data={data} />;
}

async function LowStockAlertsWrapper() {
  const alerts = await getLowStockAlerts();

  if (alerts.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Inventory logic is fully healthy. No stock alerts.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-100 dark:border-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium text-right">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((item) => (
            <tr
              key={item.id}
              className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
              <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                {item.name}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`font-bold ${item.quantity <= 0 ? "text-red-600" : "text-orange-500"}`}
                >
                  {item.quantity}
                </span>
                <span className="text-xs text-slate-400 ml-1">
                  / {item.threshold}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function RecentActivityWrapper() {
  const result = await getRecentActivityAction(5);
  const activities = result.success ? result.data || [] : [];

  if (activities.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No recent activity
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "lead":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-green-500/10 text-green-500";
      case "booking":
        return "bg-blue-500/10 text-blue-500";
      case "lead":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-slate-500/10 text-slate-500";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div
          key={activity.id}
          className={`flex items-center gap-4 pb-4 ${idx < activities.length - 1 ? "border-b border-border" : ""}`}
        >
          <div
            className={`p-2 rounded-full flex-shrink-0 ${getActivityColor(activity.type)}`}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {activity.subtitle}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <Badge variant="outline" className="text-[10px]">
              {activity.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN DASHBOARD PAGE
// ----------------------------------------------------------------------

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Command Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time analytics and platform overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-black mt-1">
                  Rs. {summary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 text-green-500 rounded-full">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </p>
                <p className="text-2xl font-black mt-1">
                  {summary.pendingOrders}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Bookings
                </p>
                <p className="text-2xl font-black mt-1">
                  {summary.activeBookings}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-full">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Low Stock Alerts
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-black text-orange-500">
                    {summary.lowStockItems}
                  </p>
                  <span className="text-xs text-muted-foreground font-medium">
                    products
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-full animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Area Chart */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">
                  Revenue & Orders Timeline
                </CardTitle>
                <CardDescription>
                  Daily performance over the last 30 days
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
              >
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueChartWrapper />
            </Suspense>
          </CardContent>
        </Card>

        {/* Donut Chart Side Panel */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Booking Distribution</CardTitle>
            <CardDescription>
              Current status of all logged service bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <BookingStatusChartWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Chart Row: Growth & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-md">
                Customer Growth (30 Days)
              </CardTitle>
            </div>
            <CardDescription>
              New unique accounts created per day
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <Suspense fallback={<ChartSkeleton />}>
              <CustomerGrowthWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-indigo-500" />
              <CardTitle className="text-md">Revenue by Category</CardTitle>
            </div>
            <CardDescription>
              Sales distribution across product types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <CategoryRevenueWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Tertiary Chart Row: Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Top 5 Selling Products</CardTitle>
            <CardDescription>
              Highest moving inventory by volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ChartSkeleton />}>
              <TopProductsChartWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Most Popular Services</CardTitle>
            <CardDescription>
              Highest conversion service bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <Suspense fallback={<ChartSkeleton />}>
              <TopServicesWrapper />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Tracking Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity Log</CardTitle>
            <CardDescription>Real-time platform events</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            <Suspense
              fallback={
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                      <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              }
            >
              <RecentActivityWrapper />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-red-500/20 dark:border-red-500/20 flex flex-col h-[400px]">
          <CardHeader className="bg-red-50/50 dark:bg-red-950/20 rounded-t-xl pb-4 border-b border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg text-red-900 dark:text-red-400">
                Critical Stock Alerts
              </CardTitle>
            </div>
            <CardDescription className="text-red-700/70 dark:text-red-400/70">
              Products nearing exhaustion requiring immediate reorder.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-y-auto">
            <Suspense fallback={<ChartSkeleton />}>
              <LowStockAlertsWrapper />
            </Suspense>

            <div className="mt-4 flex justify-end">
              <Link
                href="/admin/dashboard/inventory"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                View All Inventory →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
