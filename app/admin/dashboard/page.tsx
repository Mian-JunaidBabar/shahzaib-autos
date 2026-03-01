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

// Charts
import { RevenueAreaChart } from "@/components/admin/charts/RevenueAreaChart";
import { TopProductsBarChart } from "@/components/admin/charts/TopProductsBarChart";
import { BookingStatusDonut } from "@/components/admin/charts/BookingStatusDonut";
import { ChartSkeleton } from "@/components/admin/charts/chart-skeleton";

export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------
// DATA WRAPPERS WITH SUSPENSE
// ----------------------------------------------------------------------

async function RevenueChartWrapper() {
  const data = await getRevenueOverTime(30);
  return <RevenueAreaChart data={data} />;
}

async function TopProductsChartWrapper() {
  const data = await getTopSellingProducts();
  return <TopProductsBarChart data={data} />;
}

async function BookingStatusChartWrapper() {
  const data = await getBookingStatusDistribution();
  return <BookingStatusDonut data={data} />;
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
        return "bg-gray-500/10 text-gray-500";
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
            className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {activity.subtitle}
            </p>
          </div>
          <div className="text-right">
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
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

      {/* Top Headline Cards (Awaited at Top Level for Fast Paint) */}
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
                <p className="text-2xl font-black text-orange-500 mt-1">
                  {summary.lowStockItems}
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 text-orange-500 rounded-full animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Main Area Chart */}
            <Card className="col-span-1 lg:col-span-4 shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue & Orders</CardTitle>
                <CardDescription>
                  Daily performance over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-0">
                <Suspense fallback={<ChartSkeleton />}>
                  <RevenueChartWrapper />
                </Suspense>
              </CardContent>
            </Card>

            {/* Donut Chart Side Panel */}
            <Card className="col-span-1 lg:col-span-3 shadow-sm border-slate-200 dark:border-slate-800">
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

          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
        </TabsContent>

        {/* PRODUCTS TAB */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">
                  Top 5 Selling Products
                </CardTitle>
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

            <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900/50">
              <div className="text-center text-slate-500 max-w-sm">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">Inventory module pending.</p>
                <p className="text-xs mt-2">
                  More charts will be added here as the inventory management
                  system grows.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 flex items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/50">
              <div className="text-center text-slate-500 max-w-sm">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">Advanced Scheduling Insights</p>
                <p className="text-xs mt-2">
                  A dedicated bookings calendar and workshop load view will
                  appear here.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
