import Link from "next/link";

type BookingDetailsPageProps = {
  params: Promise<{ id: string }>;
};

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  status: "available" | "unavailable";
}

interface BookingEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  type: "info" | "success" | "warning" | "error";
}

const bookingData = {
  id: "BK001",
  customer: {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, AT 12345",
  },
  service: {
    name: "Oil Change & Filter",
    description: "Complete oil change with premium oil and filter replacement",
    estimatedTime: "1-2 hours",
    price: 89.99,
  },
  vehicleInfo: {
    make: "Toyota",
    model: "Camry",
    year: 2020,
    plateNumber: "ABC-1234",
    vin: "1HGCM82633A123456",
    mileage: 45000,
    color: "Silver",
  },
  appointment: {
    date: "2024-01-25",
    time: "10:00 AM",
    duration: "2 hours",
  },
  status: "confirmed" as const,
  priority: "normal" as const,
  notes:
    "Customer mentioned strange engine noise. Please check during service.",
  createdDate: "2024-01-20T09:30:00Z",
  assignedTechnician: "Mike Johnson",
};

const serviceItems: ServiceItem[] = [
  {
    id: "1",
    name: "Oil Change",
    description: "Premium synthetic oil replacement",
    estimatedTime: "30 min",
    status: "available",
  },
  {
    id: "2",
    name: "Oil Filter",
    description: "High-quality oil filter replacement",
    estimatedTime: "15 min",
    status: "available",
  },
  {
    id: "3",
    name: "Engine Inspection",
    description: "Comprehensive engine diagnostics",
    estimatedTime: "45 min",
    status: "available",
  },
];

const bookingEvents: BookingEvent[] = [
  {
    id: "1",
    title: "Booking Confirmed",
    description: "Appointment confirmed by customer service",
    timestamp: "2024-01-20T10:15:00Z",
    author: "Admin",
    type: "success",
  },
  {
    id: "2",
    title: "Technician Assigned",
    description: "Mike Johnson assigned to this appointment",
    timestamp: "2024-01-20T11:30:00Z",
    author: "Manager",
    type: "info",
  },
  {
    id: "3",
    title: "Customer Note Added",
    description: "Special instructions added for engine noise inspection",
    timestamp: "2024-01-20T14:20:00Z",
    author: "Customer Service",
    type: "info",
  },
  {
    id: "4",
    title: "Booking Created",
    description: "New service booking created by customer",
    timestamp: "2024-01-20T09:30:00Z",
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
    case "confirmed":
      return "text-blue-600 bg-blue-50";
    case "pending":
      return "text-orange-600 bg-orange-50";
    case "in-progress":
      return "text-purple-600 bg-purple-50";
    case "completed":
      return "text-green-600 bg-green-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-orange-600 bg-orange-50";
    case "normal":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export default async function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/admin/dashboard/bookings"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">
              Booking #{id}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingData.status)}`}
            >
              {bookingData.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(bookingData.priority)}`}
            >
              {bookingData.priority} priority
            </span>
          </div>
          <p className="text-muted-foreground">
            Appointment scheduled for {bookingData.appointment.date} at{" "}
            {bookingData.appointment.time}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
            Reschedule
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service Details */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Service Details
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    {bookingData.service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {bookingData.service.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Estimated Time
                      </label>
                      <p className="font-medium text-foreground">
                        {bookingData.service.estimatedTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Service Price
                      </label>
                      <p className="font-medium text-foreground">
                        ${bookingData.service.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    Service Items
                  </h4>
                  <div className="space-y-3">
                    {serviceItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <h5 className="font-medium text-foreground">
                            {item.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {item.estimatedTime}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              item.status === "available"
                                ? "text-green-600 bg-green-50"
                                : "text-red-600 bg-red-50"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Vehicle Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Make & Model
                  </label>
                  <p className="font-medium text-foreground">
                    {bookingData.vehicleInfo.year}{" "}
                    {bookingData.vehicleInfo.make}{" "}
                    {bookingData.vehicleInfo.model}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Color</label>
                  <p className="font-medium text-foreground">
                    {bookingData.vehicleInfo.color}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Plate Number
                  </label>
                  <p className="font-medium text-foreground">
                    {bookingData.vehicleInfo.plateNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Mileage
                  </label>
                  <p className="font-medium text-foreground">
                    {bookingData.vehicleInfo.mileage.toLocaleString()} miles
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">VIN</label>
                  <p className="font-medium text-foreground font-mono">
                    {bookingData.vehicleInfo.vin}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                Booking Timeline
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {bookingEvents.map((event) => (
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
                  {bookingData.customer.name}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium text-foreground">
                  {bookingData.customer.email}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium text-foreground">
                  {bookingData.customer.phone}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium text-foreground">
                  {bookingData.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Appointment Details
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Date</label>
                <p className="font-medium text-foreground">
                  {bookingData.appointment.date}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Time</label>
                <p className="font-medium text-foreground">
                  {bookingData.appointment.time}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Duration
                </label>
                <p className="font-medium text-foreground">
                  {bookingData.appointment.duration}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Assigned Technician
                </label>
                <p className="font-medium text-foreground">
                  {bookingData.assignedTechnician}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Special Notes
              </h2>
            </div>
            <div className="p-6">
              <p className="text-foreground">{bookingData.notes}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">
                    schedule
                  </span>
                  <span className="text-foreground">
                    Reschedule Appointment
                  </span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500">
                    call
                  </span>
                  <span className="text-foreground">Call Customer</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-500">
                    email
                  </span>
                  <span className="text-foreground">Send Email</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">
                    cancel
                  </span>
                  <span className="text-foreground">Cancel Booking</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
