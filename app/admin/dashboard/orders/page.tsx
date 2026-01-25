import Link from "next/link";


const orders = [
  {
    id: "12345",
    customer: "John Doe",
    email: "john@example.com",
    total: 1250.0,
    status: "completed",
    date: "2024-01-20",
    items: 3,
  },
  {
    id: "12346",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 890.0,
    status: "processing",
    date: "2024-01-19",
    items: 2,
  },
  {
    id: "12347",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 2100.0,
    status: "pending",
    date: "2024-01-18",
    items: 5,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-50";
    case "processing":
      return "text-blue-600 bg-blue-50";
    case "pending":
      return "text-orange-600 bg-orange-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders and track their status
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Create Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
            <span className="material-symbols-outlined text-primary text-2xl">
              shopping_cart
            </span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </div>
            <span className="material-symbols-outlined text-green-600 text-2xl">
              check_circle
            </span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "processing").length}
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-600 text-2xl">
              hourglass_empty
            </span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                ${orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-2xl">
              attach_money
            </span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Items</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-4">
                    <Link
                      href={`/admin/dashboard/orders/${order.id}`}
                      className="font-medium text-primary hover:text-primary/80"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{order.date}</td>
                  <td className="p-4 text-foreground">{order.items}</td>
                  <td className="p-4 text-foreground font-medium">${order.total}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/dashboard/orders/${order.id}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                      <button className="text-muted-foreground hover:text-foreground">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}