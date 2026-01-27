"use client";

export default function BookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Booking Configuration
        </h2>
      </div>
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h3 className="text-lg font-medium text-foreground">
          Appointment Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slot Duration (minutes)
            </label>
            <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>15</option>
              <option>30</option>
              <option selected>60</option>
              <option>90</option>
              <option>120</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Buffer Time (minutes)
            </label>
            <input
              type="number"
              defaultValue="15"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Time between appointments
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Advance Booking (days)
            </label>
            <input
              type="number"
              defaultValue="30"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Same Day Booking
            </label>
            <label className="flex items-center mt-3">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Allow same-day appointments</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
