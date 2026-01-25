import Link from "next/link";

type OrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  type: "info" | "success" | "warning" | "error";
}

const orderData = {
  id: "12345",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, AT 12345",
  },
  items: [
    {
      id: "1",
      name: "Premium Car Wax",
      price: 45.99,
      quantity: 2,
      image: "/placeholder-product.jpg",
    },
    {
      id: "2",
      name: "Leather Seat Covers",
      price: 129.99,
      quantity: 1,
      image: "/placeholder-product.jpg",
    },
  ] as OrderItem[],
  status: "completed",
  total: 221.97,
  subtotal: 201.97,
  tax: 20.0,
  shipping: 0.0,
  orderDate: "2024-01-20T10:30:00Z",
  estimatedDelivery: "2024-01-25",
};

const orderEvents: OrderEvent[] = [
  {
    id: "1",
    title: "Order Delivered",
    description: "Order has been successfully delivered to the customer",
    timestamp: "2024-01-25T14:30:00Z",
    author: "System",
    type: "success",
  },
  {
    id: "2",
    title: "Out for Delivery",
    description: "Package is out for delivery with courier",
    timestamp: "2024-01-25T08:00:00Z",
    author: "Admin",
    type: "info",
  },
  {
    id: "3",
    title: "Order Shipped",
    description: "Order has been shipped from warehouse",
    timestamp: "2024-01-22T16:45:00Z",
    author: "Admin",
    type: "info",
  },
  {
    id: "4",
    title: "Payment Confirmed",
    description: "Payment has been successfully processed",
    timestamp: "2024-01-20T10:35:00Z",
    author: "System",
    type: "success",
  },
  {
    id: "5",
    title: "Order Created",
    description: "New order has been created by customer",
    timestamp: "2024-01-20T10:30:00Z",
    author: "Customer",
    type: "info",
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "success":
      return "check_circle";
    case "warning":
      return "warning";
    case "error":
      return "error";
    default:
      return "info";
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-orange-500";
    case "error":
      return "text-red-500";
    default:
      return "text-blue-500";
  }
};

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

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/admin/dashboard/orders"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Order #{id}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}
            >
              {orderData.status}
            </span>
          </div>
          <p className="text-muted-foreground">
            Order placed on {new Date(orderData.orderDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Print Order
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Order Items
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-muted-foreground">
                        image
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        ${item.price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Order Timeline
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {orderEvents.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${getEventColor(event.type)} bg-opacity-10`}
                    >
                      <span
                        className={`material-symbols-outlined text-sm ${getEventColor(event.type)}`}
                      >
                        {getEventIcon(event.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-foreground">
                          {event.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        by {event.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Customer Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium text-foreground">
                  {orderData.customer.name}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium text-foreground">
                  {orderData.customer.email}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium text-foreground">
                  {orderData.customer.phone}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium text-foreground">
                  {orderData.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Order Summary
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${orderData.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">${orderData.tax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {orderData.shipping === 0 ? "Free" : `$${orderData.shipping}`}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-foreground">
                    ${orderData.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Delivery Information
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">
                  Estimated Delivery
                </label>
                <p className="font-medium text-foreground">
                  {orderData.estimatedDelivery}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Shipping Method
                </label>
                <p className="font-medium text-foreground">Standard Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
