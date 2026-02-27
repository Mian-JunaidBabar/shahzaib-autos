import { ShoppingCart, DollarSign, Users, Clock, Package, Calendar, UserPlus, AlertTriangle, ArrowUpRight, ArrowDownRight, FileText, TrendingUp, } from "lucide-react";
import { getDashboardStatsAction, getRecentActivityAction, type DashboardStats, type RecentActivity, } from "@/app/actions/dashboardActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


// Force dynamic rendering for admin pages that use authentication
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import Link from "next/link";

// Loading skeleton for stats cards
function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 mt-4" />
      </CardContent>
    </Card>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  change,
  changeType,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  change?: string;
  changeType?: "positive" | "negative";
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        {change && (
          <div className="flex items-center mt-4 text-sm">
            {changeType === "positive" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={
                changeType === "positive" ? "text-green-500" : "text-red-500"
              }
            >
              {change}
            </span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Dashboard Stats Component
async function DashboardStats({ stats }: { stats: DashboardStats }) {
  return (
    <>
      <StatsCard
        title="Total Orders"
        value={stats.orders.total}
        icon={ShoppingCart}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <StatsCard
        title="Total Revenue"
        value={`PKR ${stats.orders.revenue.toLocaleString()}`}
        icon={DollarSign}
        iconBg="bg-green-500/10"
        iconColor="text-green-500"
      />
      <StatsCard
        title="Active Customers"
        value={stats.customers.total}
        icon={Users}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <StatsCard
        title="Pending Bookings"
        value={stats.bookings.pending}
        icon={Clock}
        iconBg="bg-orange-500/10"
        iconColor="text-orange-500"
      />
    </>
  );
}

// Recent Activity List Component
function RecentActivityList({ activities }: { activities: RecentActivity[] }) {
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div
          key={activity.id}
          className={`flex items-center gap-4 pb-4 ${
            idx < activities.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div
            className={`p-2 rounded-full ${getActivityColor(activity.type)}`}
          >
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{activity.title}</p>
            <p className="text-sm text-muted-foreground truncate">
              {activity.subtitle}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">
              {activity.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTimeAgo(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        variant="outline"
        className="h-auto p-4 justify-start gap-3 hover:bg-accent"
        asChild
      >
        <Link href="/admin/dashboard/inventory/new">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-medium">Add New Product</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        className="h-auto p-4 justify-start gap-3 hover:bg-accent"
        asChild
      >
        <Link href="/admin/dashboard/customers?action=new">
          <UserPlus className="h-5 w-5 text-primary" />
          <span className="font-medium">Add Customer</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        className="h-auto p-4 justify-start gap-3 hover:bg-accent"
        asChild
      >
        <Link href="/admin/dashboard/orders?action=new">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium">Create Order</span>
        </Link>
      </Button>
    </div>
  );
}

// Additional Stats Row
function AdditionalStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-500">
                {stats.products.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">New Orders</p>
              <p className="text-2xl font-bold text-blue-500">
                {stats.orders.new}
              </p>
            </div>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">New Leads</p>
              <p className="text-2xl font-bold text-purple-500">
                {stats.leads.new}
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">VIP Customers</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.customers.vip}
              </p>
            </div>
            <Users className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dashboard Content - fetches data once and passes to children
async function DashboardContent() {
  const [statsResult, activityResult] = await Promise.all([
    getDashboardStatsAction(),
    getRecentActivityAction(5),
  ]);

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="col-span-4">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load dashboard stats. {statsResult.error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsResult.data;
  const activities = activityResult.success ? activityResult.data || [] : [];

  return (
    <>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStats stats={stats} />
      </div>

      {/* Additional Stats */}
      <AdditionalStats stats={stats} />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActions />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivityList activities={activities} />
        </CardContent>
      </Card>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Shahzaib Autos Admin Panel
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
