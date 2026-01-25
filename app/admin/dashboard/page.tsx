import "./globals.css";


export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to Shahzaib Autos Admin Panel
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-foreground">142</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <span className="material-symbols-outlined text-primary">
                shopping_cart
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500">+12%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">$24,300</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <span className="material-symbols-outlined text-green-500">
                attach_money
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500">+18%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Active Customers</p>
              <p className="text-3xl font-bold text-foreground">89</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <span className="material-symbols-outlined text-blue-500">
                people
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500">+5%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-foreground">23</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-full">
              <span className="material-symbols-outlined text-orange-500">
                pending
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-red-500">-3%</span>
            <span className="text-muted-foreground ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-muted hover:bg-accent rounded-lg transition-colors">
            <span className="material-symbols-outlined text-primary">
              add_box
            </span>
            <span className="font-medium">Add New Product</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-muted hover:bg-accent rounded-lg transition-colors">
            <span className="material-symbols-outlined text-primary">
              person_add
            </span>
            <span className="font-medium">Add Customer</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-muted hover:bg-accent rounded-lg transition-colors">
            <span className="material-symbols-outlined text-primary">
              receipt
            </span>
            <span className="font-medium">Create Order</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Activities
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="p-2 bg-green-500/10 rounded-full">
              <span className="material-symbols-outlined text-green-500 text-sm">
                check_circle
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Order #12345 completed
              </p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <span className="material-symbols-outlined text-blue-500 text-sm">
                person_add
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                New customer registered
              </p>
              <p className="text-sm text-muted-foreground">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <span className="material-symbols-outlined text-orange-500 text-sm">
                inventory
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                Low stock alert for brake pads
              </p>
              <p className="text-sm text-muted-foreground">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}